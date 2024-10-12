import express from "express";
import {
  postNuevoEstudiante,
  verEstudiante,
  nuevoEstudiante,
} from "../controllers/estudiante-controller.js";

export const estudianteRouter = express.Router();

estudianteRouter.get("/nuevo", nuevoEstudiante);
estudianteRouter.post("/nuevo", postNuevoEstudiante);
estudianteRouter.get("/ver/:id", verEstudiante);
