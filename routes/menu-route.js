import express from "express";
import { mostrarMenu } from "../controllers/menu-controller.js";

export const menuRouter = express.Router();

// Ruta para mostrar el menú
menuRouter.get("/menu", mostrarMenu);
