
import express from "express";
import {
  apiListarDocentes,
  apiPostNuevoDocente,
} from "../controllers/api-docente-controller.js";

export const apiDocenteRouter = express.Router();

// Ruta para procesar el formulario de alta de docente
apiDocenteRouter.post("/nuevo", apiPostNuevoDocente);

// Ruta para listar docentes
apiDocenteRouter.get("/lista", apiListarDocentes);