import express from "express";
import { login, logout } from "../controllers/login-controller.js";

export const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.render("login");
});

loginRouter.post("/", login);
loginRouter.get("/logout", logout);
