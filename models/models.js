export { Curso, Estudiante, Docente, Rol, Usuario };

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema y modelo de la colección de docentes
const docenteSchema = new Schema({
  nombre: String,
  dni: String,
});
const Docente = mongoose.model("Docente", docenteSchema);

// Schema y modelo de la colección de cursos
const cursoSchema = new Schema({
  nombre: String,
  docentes: [{ type: Schema.Types.ObjectId, ref: "Docente" }],
  estudiantes: [
    {
      estudiante: { type: Schema.Types.ObjectId, ref: "Estudiante" },
      calificacion: Number,
    },
  ],
});
const Curso = mongoose.model("Curso", cursoSchema);

// Schema y modelo de la colección de estudiantes
const estudianteSchema = new Schema({
  nombre: String,
  dni: String,
});
const Estudiante = mongoose.model("Estudiante", estudianteSchema);

// Schema y modelo de la colección de roles
const rolSchema = new Schema({
  nombre: String,
});
const Rol = mongoose.model("Rol", rolSchema);

// Schema y modelo de la colección de usuarios
const UsuarioSchema = new Schema({
  nombre: String,
  password: String,
  rol: { type: Schema.Types.ObjectId, ref: "Rol" },
  estudiante: { type: Schema.Types.ObjectId, ref: "Estudiante" },
  docente: { type: Schema.Types.ObjectId, ref: "Docente" },
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);
