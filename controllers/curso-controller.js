import { Docente, Estudiante, Curso } from "../models/models.js";
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

export async function postNuevoCurso(req, res) {
  try {
    let estudiantes = null;
    if (req.body.estudiantes && typeof req.body.estudiantes === "string") {
      estudiantes = [{ estudiante: req.body.estudiantes }];
    } else if (req.body.estudiantes && req.body.estudiantes.length > 1) {
      estudiantes = req.body.estudiantes.map((id) => ({ estudiante: id }));
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

    const cursoExist = await Curso.findOne({ nombre: nuevoCurso.nombre });
    if (cursoExist) {
      return res.render("curso-nuevo", {
        docentes,
        estudiantes,
        error: "No se guardo el curso nuevo. Ya existe uno con ese nombre.",
      });
    }

    await nuevoCurso.save();
    //FIXME: ponerle hora
    //FIXME no me convence que muestre el curso nuevamente como si fuera para un alta... tal vez mostrar una plantilla de éxito nomas, o de exito y con un link para editar el curso.
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

export async function listarCursos(req, res) {
  try {
    const cursos = await Curso.find().populate(
      "docentes estudiantes.estudiante"
    );
    //console.log(cursos);
    res.render("curso-lista", { cursos });
  } catch (error) {
    console.error("--- Listado de Cursos | Error al obtener datos >>> ", error);
    res.status(500).render("error", {
      message: "Listado de Cursos | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

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

export async function postEditarNotasCurso(req, res) {
  try {
    const curso = await Curso.findById(req.params.id);

    let estudiantes = [];
    for (let i = 0; i < req.body.estudianteId.length; i++) {
      estudiantes.push({
        estudiante: req.body.estudianteId[i],
        calificacion: parseInt(req.body.calificacion[i]),
      });
    }
    curso.estudiantes = estudiantes;
    await curso.save();

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
