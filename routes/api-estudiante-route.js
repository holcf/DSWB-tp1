import express from "express";
import {
  apiPostNuevoEstudiante,
  apiVerEstudiante,
} from "../controllers/api-estudiante-controller.js";
import { verifyAdmin, verifyEstudiante } from "../auth.js";

export const apiEstudianteRouter = express.Router();

// Ruta para procesar el formulario de alta de estudiante
// verificamos que el usuario sea administrador

apiEstudianteRouter.post("/nuevo", verifyAdmin, apiPostNuevoEstudiante);

// Ruta para ver información de un estudiante
// verificamos que el usuario sea el mismo estudiante que se consulta o que
// sea administrador
apiEstudianteRouter.get("/ver/:id", verifyEstudiante, apiVerEstudiante);
