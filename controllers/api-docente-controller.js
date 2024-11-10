
import { Docente, Curso, Usuario, Rol } from "../models/models.js";

/**
 * Controlador para listar docentes a través de la API.
 */
export async function apiListarDocentes(req, res) {
  try {
    const listadoDocentes = await Docente.find();
    await Curso.find()
      .populate("docentes")
      .then((cursos) => {
        cursos.forEach((curso) => {
          curso.docentes &&
            curso.docentes.forEach((docente) => {
              let indexDocente = listadoDocentes.findIndex((d) =>
                d._id.equals(docente._id)
              );
              if (listadoDocentes[indexDocente].cursos) {
                listadoDocentes[indexDocente].cursos.push(curso.nombre);
              } else {
                listadoDocentes[indexDocente] = {
                  _id: docente._id,
                  nombre: docente.nombre,
                  dni: docente.dni,
                  cursos: [curso.nombre],
                };
              }
            });
        });
      });

    res.status(200).json(listadoDocentes);
  } catch (error) {
    console.error("--- Error al listar docentes >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Controlador para guardar un nuevo docente a través de la API.
 */
export async function apiPostNuevoDocente(req, res) {
  try {
    const nuevoDocente = new Docente(req.body);
    const docenteExist = await Docente.findOne({ dni: nuevoDocente.dni });

    if (docenteExist) {
      return res.status(400).json({ error: "Docente ya existe" });
    }

    await nuevoDocente.save();

    const doc = await Docente.findOne({ dni: nuevoDocente.dni });
    const rol = await Rol.findOne({ nombre: "docente" });

    const nuevoUsuario = new Usuario({
      nombre: nuevoDocente.dni,
      password: nuevoDocente.dni,
      rol: rol._id,
      docente: doc._id,
      estudiante: null,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Docente guardado con éxito" });
  } catch (error) {
    console.error("--- Error al guardar docente >>> ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}