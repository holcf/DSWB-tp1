
import { Estudiante, Curso, Usuario, Rol } from "../models/models.js";

/**
 * Controlador para ver información de un estudiante a través de la API.
 */
export async function apiVerEstudiante(req, res) {
  try {
    let estudiante = await Estudiante.findById(req.params.id);
    let cursos = await buscarCursosPorEstudiante(req.params.id);
    res.status(200).json({ estudiante, cursos });
  } catch (error) {
    console.error("--- Error al ver estudiante >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Función para buscar los cursos en los que está inscrito un estudiante (junto con sus calificaciones).
 */
async function buscarCursosPorEstudiante(estudianteId) {
  try {
    const cursos = await Curso.find({
      "estudiantes.estudiante": estudianteId,
    })
      .populate("estudiantes.estudiante")
      .exec();

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
 * Controlador para procesar el alta de estudiante a través de la API.
 */
export async function apiPostNuevoEstudiante(req, res) {
  try {
    const nuevoEstudiante = new Estudiante(req.body);

    const estudianteExist = await Estudiante.findOne({
      dni: nuevoEstudiante.dni,
    });
    if (estudianteExist) {
      return res.status(400).json({ error: "El estudiante ya existe" });
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

    res.status(201).json({ message: "Estudiante guardado con éxito" });
  } catch (error) {
    console.error("--- Error al guardar estudiante >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}