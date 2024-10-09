import express from "express";
import {
  //listarEstudiantes,
  postNuevoEstudiante,
} from "../controllers/estudiante-controller.js";

import { Estudiante, Curso } from "../models/models.js";

export const estudianteRouter = express.Router();

estudianteRouter.get("/nuevo", (req, res) => {
  res.render("estudiante-nuevo");
});

estudianteRouter.post("/nuevo", postNuevoEstudiante);

estudianteRouter.get("/info/:dni", infoEstudiante);
estudianteRouter.get("/ver/:id", verEstudiante);

async function verEstudiante(req, res) {
  let estudiante = await Estudiante.findById(req.params.id);

  let cursos = await buscarCursosPorEstudiante(req.params.id);
  console.log("cursos", cursos);
  res.render("estudiante-ver", { estudiante, cursos });
}

async function infoEstudiante(req, res) {
  console.log("req.params.dni", req.params.dni);
  let estudiante = await Estudiante.findOne({ dni: req.params.dni });
  console.log("estudiante", estudiante);
  res.render("estudiante-info", { estudiante });
}

const estudianteId = "id_del_estudiante"; // Reemplázalo por el ObjectId real del estudiante

async function buscarCursosPorEstudiante(estudianteId) {
  try {
    // Busca los cursos donde el estudiante está inscrito
    const cursos = await Curso.find({
      "estudiantes.estudiante": estudianteId,
    })
      .populate("estudiantes.estudiante")
      .exec();

    // Procesa los cursos para extraer las calificaciones correspondientes
    const cursosConCalificacion = cursos.map((curso) => {
      // Busca la calificación del estudiante en el curso actual
      const estudianteEnCurso = curso.estudiantes.find(
        (e) => e.estudiante._id.toString() === estudianteId
      );

      return {
        curso: curso.nombre,
        calificacion: estudianteEnCurso ? estudianteEnCurso.calificacion : null,
      };
    });

    console.log(cursosConCalificacion);
    return cursosConCalificacion;
  } catch (err) {
    console.error("Error al buscar cursos por estudiante:", err);
  }
}
//estudiantesRouter.get("/lista", listarEstudiantes);
