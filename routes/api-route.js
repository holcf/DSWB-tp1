import express from "express";
import { apiLogin } from "../controllers/api-controller.js";
import { apiLogout } from "../controllers/api-controller.js";

export const apiRouter = express.Router();

// Ruta para procesar el login a través de la API
apiRouter.post("/login", apiLogin);

// Ruta para procesar el logout a través de la API
apiRouter.get("/logout", apiLogout);
