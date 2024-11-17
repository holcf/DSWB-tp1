import { Docente, Estudiante, Curso } from "../models/models.js";

/**
 * Controlador para la vista de alta de curso. Obtiene los docentes
 * y estudiantes para mostrar en el formulario.
 */
export async function nuevoCurso(req, res) {
  try {
    const docentes = await Docente.find();
    const estudiantes = await Estudiante.find();

    res.render("curso-nuevo", { docentes, estudiantes });
  } catch (error) {
    console.error("--- Alta de curso | Error al obtener datos >>> ", error);
    res.status(500).render("error", {
      message: "Alta de Curso | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

/**
 * Controlador para guardar un nuevo curso. Es llamado cuando se envía el
 * formulario de alta de curso.
 * Recibe los datos del formulario y los guarda en la base de datos.
 */
export async function postNuevoCurso(req, res) {
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
      return res.render("curso-nuevo", {
        docentes,
        estudiantes,
        error: "No se guardo el curso nuevo. Ya existe uno con ese nombre.",
      });
    }

    await nuevoCurso.save();
    res.render("curso-nuevo", {
      docentes,
      estudiantes,
      success: "Curso guardardo con éxito",
    });
  } catch (error) {
    console.error("--- Error al guardar curso >>> ", error);
    res.status(500).render("error", {
      message: "Alta de Curso | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

/**
 * Controlador para mostrar la lista de cursos. Obtiene los cursos
 * de la base de datos y los muestra en la vista.
 */
export async function listarCursos(req, res) {
  try {
    // Obtenemos los cursos junto con los datos de docentes y estudiantes
    const cursos = await Curso.find().populate(
      "docentes estudiantes.estudiante"
    );

    res.render("curso-lista", { cursos });
  } catch (error) {
    console.error("--- Listado de Cursos | Error al obtener datos >>> ", error);
    res.status(500).render("error", {
      message: "Listado de Cursos | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

/**
 * Controlador para mostrar la vista de edición de notas de un curso.
 * Obtiene el curso de la base de datos y lo muestra en la vista.
 */
export async function editarNotasCurso(req, res) {
  try {
    const curso = await Curso.findById(req.params.id).populate(
      "docentes estudiantes.estudiante"
    );
    res.render("curso-editar-notas", { curso });
  } catch (error) {
    console.error("--- Editar Notas | Error al obtener datos >>> ", error);
    res.status(500).render("error", {
      message: "Editar Notas | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

/**
 * Controlador para guardar las notas editadas de un curso.
 * Recibe los datos del formulario y los guarda en la base de datos.
 */

export async function postEditarNotasCurso(req, res) {
  try {
    let curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).render("error", {
        message: "Editar Notas | Curso no encontrado.",
        errorCode: 404,
      });
    }

    if (!req.body.estudianteId || !req.body.calificacion) {
      return res.status(400).render("error", {
        message: "Editar Notas | Datos incompletos.",
        errorCode: 400,
      });
    }

    // Le damos formato a los datos de estudiantes y calificaciones
    // del formulario
    let estudiantes = [];
    for (let i = 0; i < req.body.estudianteId.length; i++) {
      estudiantes.push({
        estudiante: req.body.estudianteId[i],
        calificacion: parseInt(req.body.calificacion[i]),
      });
    }
    curso.estudiantes = estudiantes;
    await curso.save();

    //traemos nuevamente los datos del curso para mostrarlos si se quiere seguir editando notas
    curso = await Curso.findById(req.params.id).populate(
      "docentes estudiantes.estudiante"
    );

    let now = new Date();
    res.render("curso-editar-notas", {
      curso,
      success: "Notas guardadas. " + now.toLocaleTimeString(),
    });
  } catch (error) {
    console.error("--- Editar Notas | Error al guardar datos >>> ", error);
    res.status(500).render("error", {
      message: "Editar Notas | Error interno del servidor.",
      errorCode: 500,
    });
  }
}
