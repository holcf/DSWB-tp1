import express from "express";
import {
  //listarEstudiantes,
  postNuevoEstudiante,
} from "../controllers/estudiante-controller.js";

import { Estudiante } from "../models/models.js";

export const estudianteRouter = express.Router();

estudianteRouter.get("/nuevo", (req, res) => {
  res.render("estudiante-nuevo");
});

estudianteRouter.post("/nuevo", postNuevoEstudiante);

estudianteRouter.get("/info/:dni", infoEstudiante);

async function infoEstudiante(req, res) {
  console.log("req.params.dni", req.params.dni);
  let estudiante = await Estudiante.findOne({ dni: req.params.dni });
  console.log("estudiante", estudiante);
  res.render("estudiante-info", { estudiante });
}

//TODO: tendría que traer también los datos para ver cursos materias, notas, etc

//estudiantesRouter.get("/lista", listarEstudiantes);
