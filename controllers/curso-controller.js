import { Docente, Estudiante, Curso } from "../models/models.js";
export async function nuevoCurso(req, res) {
  try {
    const docentes = await Docente.find();
    const estudiantes = await Estudiante.find();
    res.render("curso-nuevo", { docentes, estudiantes });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
}
