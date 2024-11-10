import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { menuRouter } from "./routes/menu-route.js";
import { loginRouter } from "./routes/login-route.js";
import { cargarDatosInicio } from "./models/datos-inicio.js";
import { docenteRouter } from "./routes/docente-route.js";
import { estudianteRouter } from "./routes/estudiante-route.js";
import { cursoRouter } from "./routes/curso-route.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { verifyToken } from "./auth.js";
import { apiRouter } from "./routes/api-route.js";
import { apiCursoRouter } from "./routes/api-curso-route.js";
import { apiEstudianteRouter } from "./routes/api-estudiante-route.js";
import { apiDocenteRouter } from "./routes/api-docente-route.js";

dotenv.config();

connectMongo(process.env.MONGODB_URI);

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", "./views");

// no mover, debe estar antes de verifyToken para que no se aplique a la ruta de login de la api
app.use("/api", apiRouter);

// Middleware para verificar el token y colocar los datos del usuario en el body
app.use(verifyToken);

app.use(loginRouter);
app.use(menuRouter);
app.use("/docente", docenteRouter);
app.use("/estudiante", estudianteRouter);
app.use("/curso", cursoRouter);

app.use("/api/cursos", apiCursoRouter);
app.use("/api/estudiantes", apiEstudianteRouter);
app.use("/api/docentes", apiDocenteRouter);

app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Conexión a la base de datos

async function connectMongo(uri) {
  let connection;
  try {
    connection = await mongoose.connect(uri, {});
  } catch (error) {
    console.log("Error de conexión a MongoDB", error, uri);
    try {
      connection = await mongoose.connect(
        "mongodb://localhost:27017/tpback",
        {}
      );
    } catch (e) {
      console.log("Error de conexión a MongoDB", e, uri);
    }
  }

  if (connection) {
    console.log("Conectado a MongoDB", uri);
    cargarDatosInicio();
  } else {
    console.log("Error al conectar con la base de datos");
    process.exit(1);
  }
}
