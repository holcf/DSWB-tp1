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
  const { nombre, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ nombre, password }).populate("rol");
    console.log(usuario, nombre, password);
    if (!usuario) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    //Si el usuario es docente busca los cursos en los que está para mostrarlos
    //en su menú y poder acceder a ellos.
    //Hay que hacerlo acá mientras no tengamos sesiones porque si se sale del menu a otra página con un redirect/get se pierde el req.body
    let cursos = null;
    if (usuario.rol.nombre === "docente") {
      cursos = await Curso.find({ docentes: usuario.docente })
        .populate("docentes estudiantes.estudiante")
        .exec();
    }

    res.render("menu", { usuario, cursos });

    //TODO: pendiente a implementar cuando esté resulto el tema de las sesiones
    //Guardar al usuario en la sesión
    //req.usuario = usuario;

    // Redirigir al menú de inicio
    //res.redirect("/");
    // no hacemos el redirect porque es un get y se pierde el req.body si no se usa session
    // res.render("menu", { usuario });
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
  //TODO: pendiente a implementar cuando esté resulto el tema de la session
  //req.session.destroy();
  //si no hay sesion habrìa que borrar usuario
  //req.usuario = null;
  res.redirect("/");
}
