
import express from "express";
import {
  apiNuevoCurso,
  apiListarCursos,
  apiEditarNotasCurso,
} from "../controllers/api-curso-controller.js";

export const apiCursoRouter = express.Router();

// Ruta para crear un nuevo curso a través de la API
apiCursoRouter.post("/nuevo", apiNuevoCurso);

// Ruta para listar cursos a través de la API
apiCursoRouter.get("/lista", apiListarCursos);

// Ruta para editar notas de un curso a través de la API
apiCursoRouter.put("/editar/:id", apiEditarNotasCurso);