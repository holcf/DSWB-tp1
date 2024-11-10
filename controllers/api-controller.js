import { hashPassword, createToken, getSecretKey } from "../auth.js";
import { Usuario } from "../models/models.js";

/**
 * Controlador para procesar el login a través de la API.
 */
export async function apiLogin(req, res) {
  const { nombre, password, rememberMe } = req.body;

 

  try {
    const usuario = await Usuario.findOne({
      nombre,
      password: hashPassword(password),
    }).populate("rol");

    if (!usuario) {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos" });
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

    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Login exitoso", payload: { usuario } });
  } catch (error) {
    console.error("--- Error en login >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Controlador para cerrar sesión a través de la API.
 */

export function apiLogout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout exitoso" });
}
