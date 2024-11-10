
import express from "express";
import {
  apiPostNuevoEstudiante,
  apiVerEstudiante,
} from "../controllers/api-estudiante-controller.js";

export const apiEstudianteRouter = express.Router();

// Ruta para procesar el formulario de alta de estudiante
apiEstudianteRouter.post("/nuevo", apiPostNuevoEstudiante);

// Ruta para ver información de un estudiante
apiEstudianteRouter.get("/ver/:id", apiVerEstudiante);