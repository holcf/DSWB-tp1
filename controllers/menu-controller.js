import { Curso } from "../models/models.js";

/**
 * Controlador para mostrar el menú basado en el rol del usuario
 */
export const mostrarMenu = async (req, res) => {
  // el usuario llega en el payload del body porque pasa por el middleware de
  // verificación de token
  let usuario = req.body.payload.usuario;

  //Si el usuario es docente busca los cursos en los que está para mostrarlos
  let cursos = null;
  if (usuario.rol.nombre === "docente") {
    cursos = await Curso.find({ docentes: usuario.docente })
      .populate("docentes estudiantes.estudiante")
      .exec();
  }

  res.render("menu", { usuario, cursos });
};
