import express from "express";
import { nuevoCurso, postNuevoCurso } from "../controllers/curso-controller.js";

export const cursoRouter = express.Router();

// Ruta para mostrar el formulario de alta de curso con docentes y estudiantes
cursoRouter.get("/nuevo", nuevoCurso);

// Ruta para procesar el formulario de alta de curso
cursoRouter.post("/nuevo", postNuevoCurso);