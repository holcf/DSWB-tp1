import express from "express";
import {
  listarDocentes,
  postNuevoDocente,
  nuevoDocente,
} from "../controllers/docente-controller.js";

export const docenteRouter = express.Router();

// Ruta para mostrar el formulario de alta de docente
docenteRouter.get("/nuevo", nuevoDocente);

// Ruta para procesar el formulario de alta de docente
docenteRouter.post("/nuevo", postNuevoDocente);

// Ruta para listar docentes
docenteRouter.get("/lista", listarDocentes);
