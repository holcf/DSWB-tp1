import { Estudiante, Curso } from "../models/models.js";

export async function postNuevoEstudiante(req, res) {
  try {
    const nuevoEstudiante = new Estudiante(req.body);

    const estudianteExist = await Estudiante.findOne({
      dni: nuevoEstudiante.dni,
    });
    if (estudianteExist) {
      return res.render("estudiante-nuevo", {
        error: "El estudiante ya existe",
      });
    }

    await nuevoEstudiante.save();

    const nuevoUsuario = new Usuario({
      nombre: nuevoEstudiante.dni,
      password: nuevoEstudiante.dni,
      rol: "estudiante",
      estudiante: nuevoEstudiante._id,
      docente: null,
    });

    await nuevoUsuario.save();

    res.render("estudiante-nuevo", {
      success: "Estudiante guardardo con éxito",
    });
  } catch (error) {
    console.error("--- Error al guardar estudiante >>> ", error);
    res.status(500).render("error", {
      message: "Alta de estudiante | Error interno del servidor.",
      errorCode: 500,
    });
  }
}
