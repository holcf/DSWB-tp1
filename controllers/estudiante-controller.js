import { Estudiante, Curso, Usuario, Rol } from "../models/models.js";

/**
 * Controlador para la vista de alta de estudiante
 */
export function nuevoEstudiante(req, res) {
  res.render("estudiante-nuevo");
}

/**
 * Controlador para la vista de ver estudiante. Envía los datos del estudiante
 * y los cursos en los que está inscrito (con sus respectivas calificaciones).
 * Recibe el id del estudiante como parámetro.
 */
export async function verEstudiante(req, res) {
  let estudiante = await Estudiante.findById(req.params.id);
  let cursos = await buscarCursosPorEstudiante(req.params.id);
  console.log("cursos", cursos);
  res.render("estudiante-ver", { estudiante, cursos });
}

/**
 * Función para buscar los cursos en los que está inscrito un estudiante (junto con sus calificaciones).
 */
export async function buscarCursosPorEstudiante(estudianteId) {
  try {
    // Busca los cursos donde el estudiante está inscrito
    const cursos = await Curso.find({
      "estudiantes.estudiante": estudianteId,
    })
      .populate("estudiantes.estudiante")
      .exec();

    // Procesa los cursos para extraer las calificaciones correspondientes
    const cursosConCalificacion = cursos.map((curso) => {
      const estudianteEnCurso = curso.estudiantes.find(
        (e) => e.estudiante._id.toString() === estudianteId
      );
      return {
        curso: curso.nombre,
        calificacion: estudianteEnCurso ? estudianteEnCurso.calificacion : null,
      };
    });

    return cursosConCalificacion;
  } catch (err) {
    console.error("Error al buscar cursos por estudiante:", err);
  }
}

/**
 * Controlador para procesar el formulario de alta de estudiante. Guarda el estudiante en la base de datos y crea un usuario asociado.
 */
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

    const doc = await Estudiante.findOne({ dni: nuevoEstudiante.dni });
    const rol = await Rol.findOne({ nombre: "estudiante" });
    const nuevoUsuario = new Usuario({
      nombre: nuevoEstudiante.dni,
      password: nuevoEstudiante.dni,
      rol: rol._id,
      estudiante: doc._id,
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
