import { Usuario, Curso } from "../models/models.js";

export async function login(req, res) {
  const { nombre, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ nombre, password }).populate("rol");

    if (!usuario) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    //esto para mostrar los cursos del docente en el menu mientras no haya session
    let cursos = null;
    if (usuario.rol.nombre === "docente") {
      cursos = await Curso.find({ docentes: usuario.docente })
        .populate("docentes estudiantes.estudiante")
        .exec();
    }

    res.render("menu", { usuario, cursos });

    //TODO: pendiente a implementar cuando esté resulto el tema de la session
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

// Controlador para cerrar sesión
export const logout = (req, res) => {
  //TODO: pendiente a implementar cuando esté resulto el tema de la session
  //req.session.destroy();
  //si no hay sesion habrìa que borrar usuario
  //req.usuario = null;
  res.redirect("/");
};
