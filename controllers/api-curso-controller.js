import { Curso } from "../models/models.js";

/**
 * Controlador para crear un nuevo curso a través de la API.
 */
export async function apiNuevoCurso(req, res) {
  try {
    // Le damos formato a los datos de estudiantes y docentes del formulario
    // para guardarlos en la base de datos
    let estudiantes = null;
    if (req.body.estudiantes && typeof req.body.estudiantes === "string") {
      estudiantes = [{ estudiante: req.body.estudiantes }];
    } else if (req.body.estudiantes && req.body.estudiantes.length > 1) {
      estudiantes = req.body.estudiantes.map((id) => ({
        estudiante: id,
        calificacion: null,
      }));
    }

    let docentes = null;
    if (req.body.docentes && typeof req.body.docentes === "string") {
      docentes = [req.body.docentes];
    } else if (req.body.docentes && req.body.docentes.length > 1) {
      docentes = req.body.docentes;
    }
    const nuevoCurso = new Curso({
      nombre: req.body.nombre,
      docentes: docentes,
      estudiantes: estudiantes,
    });

    // Verificar si ya existe un curso con el mismo nombre
    const cursoExist = await Curso.findOne({ nombre: nuevoCurso.nombre });
    if (cursoExist) {
      return res
        .status(400)
        .json({ error: "Ya existe un curso con ese nombre." });
    }

    await nuevoCurso.save();
    res.status(201).json({ message: "Curso guardado con éxito" });
  } catch (error) {
    console.error("--- Error al guardar curso >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Controlador para listar cursos a través de la API.
 */
export async function apiListarCursos(req, res) {
  try {
    const cursos = await Curso.find().populate(
      "docentes estudiantes.estudiante"
    );
    res.status(200).json(cursos);
  } catch (error) {
    console.error("--- Error al listar cursos >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Controlador para editar notas de un curso a través de la API.
 */
export async function apiEditarNotasCurso(req, res) {
  try {
    let curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Le damos formato a los datos de estudiantes y calificaciones
    // del formulario
    let estudiantes = [];
    if (!req.body.estudianteId || !req.body.calificacion) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    for (let i = 0; i < req.body.estudianteId.length; i++) {
      estudiantes.push({
        estudiante: req.body.estudianteId[i],
        calificacion: parseInt(req.body.calificacion[i]),
      });
    }
    curso.estudiantes = estudiantes;
    console.log("CURSO: ", curso);
    await curso.save();

    res.status(200).json({ message: "Notas guardadas con éxito" });
  } catch (error) {
    console.error("--- Error al editar notas >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
