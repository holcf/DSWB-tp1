import { Docente, Curso, Usuario, Rol } from "../models/models.js";

export async function listarDocentes(req, res) {
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

    res.render("docente-lista", { docentes: listadoDocentes });
  } catch (error) {
    console.error("--- Error al listar docentes >>> ", error);
    res.status(500).render("error", {
      message: "Listado de Docentes | Error interno del servidor.",
      errorCode: 500,
    });
  }
}

export async function postNuevoDocente(req, res) {
  try {
    const nuevoDocente = new Docente(req.body);
    const docenteExist = await Docente.findOne({ dni: nuevoDocente.dni });

    if (docenteExist) {
      return res.render("docente-nuevo", { error: "Docente ya existe" });
    }

    await nuevoDocente.save();

    const doc = await Docente.findOne({ dni: nuevoDocente.dni });
    const rol = await Rol.findOne({ nombre: "docente" });

    console.log("lista roles >>> ", rol.nombre, rol._id);

    const nuevoUsuario = new Usuario({
      nombre: nuevoDocente.dni,
      password: nuevoDocente.dni,
      rol: rol._id,
      docente: doc._id,
      estudiante: null,
    });

    await nuevoUsuario.save();

    res.render("docente-nuevo", { success: "Docente guardardo con éxito" });
  } catch (error) {
    console.error("--- Error al guardar docente >>> ", error);
    res.status(500).render("error", {
      message: "Alta de docente | Error interno del servidor.",
      errorCode: 500,
    });
  }
}
