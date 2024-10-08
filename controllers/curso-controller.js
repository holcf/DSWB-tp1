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
    const nuevoCurso = new Curso({
      nombre: req.body.nombre,
      docentes: req.body.docentes,
      estudiantes: req.body.estudiantes.map((id) => ({ estudiante: id })),
    });
    await nuevoCurso.save();
    res.redirect("/curso/nuevo");
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
