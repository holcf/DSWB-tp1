import { hashPassword, createToken, getSecretKey } from "../auth.js";
import { Usuario, Curso } from "../models/models.js";

/**
 * Controlador para mostrar la vista de login.
 */
export function getLogin(req, res) {
  res.render("login");
}

/**
 * Controlador para procesar el formulario de login.
 * Comprueba si el usuario y contraseña corresponden a un usuario
 * registrado en la base de datos.
 * Luego del login muestra la vista del menú (temporalmente hasta que se
 * implementen las sesiones, cuando esté eso se redireccionará al menú con
 * los datos del usuario).
 */
export async function postLogin(req, res) {
  const { nombre, password, rememberMe } = req.body;

  // Si ya hay una cookie con el token redirigimos al menú
  if (req.cookies?.token) {
    res.redirect("/menu");
    return;
  }

  try {
    const usuario = await Usuario.findOne({
      nombre,
      password: hashPassword(password),
    }).populate("rol");

    if (!usuario) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    const token = await createToken(
      {
        usuario: usuario,
        rememberMe: rememberMe || null,
      },
      getSecretKey()
    );

    let cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, //30d o 1h
    };

    // enviamos la cookie con el token al cliente y redirijimos al menú
    res.cookie("token", token, cookieOptions);
    res.redirect("/menu");
  } catch (error) {
    console.error("--- Error en login >>> ", error);
    res.status(500).render("error", {
      message: "Login | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

/**
 * Controlador para cerrar la sesión del usuario.
 */
export function logout(req, res) {
  // Borramos la cookie con el token para cerrar la sesión
  res.clearCookie("token");
  res.redirect("/");
}
