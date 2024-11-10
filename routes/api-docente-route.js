import express from "express";
import {
  apiListarDocentes,
  apiPostNuevoDocente,
} from "../controllers/api-docente-controller.js";
import { verifyAdmin } from "../auth.js";

export const apiDocenteRouter = express.Router();

// Ruta para procesar el formulario de alta de docente
// verificamos que el usuario sea administrador
apiDocenteRouter.post("/nuevo", verifyAdmin, apiPostNuevoDocente);

// Ruta para listar docentes
// verificamos que el usuario sea administrador
apiDocenteRouter.get("/lista", verifyAdmin, apiListarDocentes);
