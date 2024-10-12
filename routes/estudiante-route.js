import express from "express";
import {
  postNuevoEstudiante,
  verEstudiante,
  nuevoEstudiante,
} from "../controllers/estudiante-controller.js";

export const estudianteRouter = express.Router();

// Ruta para mostrar el formulario de alta de estudiante
estudianteRouter.get("/nuevo", nuevoEstudiante);

// Ruta para procesar el formulario de alta de estudiante
estudianteRouter.post("/nuevo", postNuevoEstudiante);

// Ruta para ver información de un estudiante
estudianteRouter.get("/ver/:id", verEstudiante);
