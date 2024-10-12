import express from "express";
import { postLogin, logout } from "../controllers/login-controller.js";

export const loginRouter = express.Router();

// Ruta para mostrar el formulario de login
loginRouter.get("/", getLogin);

// Ruta para procesar el formulario de login
loginRouter.post("/", postLogin);

// Ruta para cerrar la sesión del usuario
loginRouter.get("/logout", logout);
