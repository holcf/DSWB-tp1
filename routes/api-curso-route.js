import express from "express";
import {
  apiNuevoCurso,
  apiListarCursos,
  apiEditarNotasCurso,
} from "../controllers/api-curso-controller.js";

import { verifyAdmin, verifyListaCursos, verifyEdicionCurso } from "../auth.js";

export const apiCursoRouter = express.Router();

// Ruta para crear un nuevo curso a través de la API
// verificamos que el usuario sea administrador
apiCursoRouter.post("/nuevo", verifyAdmin, apiNuevoCurso);

// Ruta para listar cursos a través de la API
// verificamos que el usuario sea administrador o docente
apiCursoRouter.get("/lista", verifyListaCursos, apiListarCursos);

// Ruta para editar notas de un curso a través de la API
// verificamos que el usuario sea administrador o docente del curso
apiCursoRouter.put("/editar/:id", verifyEdicionCurso, apiEditarNotasCurso);
