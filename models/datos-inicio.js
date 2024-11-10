import mongoose from "mongoose";
import { Curso, Estudiante, Docente, Rol, Usuario } from "./models.js";
import { hashPassword } from "../auth.js";

/**
 * Carga datos de ejemplo en la base de datos.
 */
export async function cargarDatosInicio() {
  // Para borrar todas las colecciones
  /* await Rol.deleteMany();
  await Estudiante.deleteMany();
  await Docente.deleteMany();
  await Usuario.deleteMany();
  await Curso.deleteMany(); */

  // Verificar si hay datos en la base de datos
  const countRoles = await Rol.countDocuments();
  const countEstudiantes = await Estudiante.countDocuments();
  const countDocentes = await Docente.countDocuments();
  const countUsuarios = await Usuario.countDocuments();
  const countCursos = await Curso.countDocuments();

  if (
    countRoles > 0 ||
    countEstudiantes > 0 ||
    countDocentes > 0 ||
    countUsuarios > 0 ||
    countCursos > 0
  ) {
    console.log("Datos de ejemplo ya cargados");
    return;
  }

  console.log("Cargando datos de ejemplo...");

  // Carga roles
  const roles = [
    { nombre: "administrador" },
    { nombre: "docente" },
    { nombre: "estudiante" },
    { nombre: "familiar" },
  ];

  try {
    await Rol.insertMany(roles);
  } catch (error) {
    console.error("Roles. Error al cargar datos de ejemplo:", error.message);
  }

  // Carga estudiantes
  const estudiantes = [
    { nombre: "Juan Pérez", dni: "1234" },
    { nombre: "María Gómez", dni: "123455" },
    { nombre: "Luis Rodríguez", dni: "34567890" },
    { nombre: "Ana Torres", dni: "45678901" },
    { nombre: "Carlos Sánchez", dni: "56789012" },
    { nombre: "Laura Díaz", dni: "67890123" },
    { nombre: "Pedro Martínez", dni: "78901234" },
    { nombre: "Lucía Fernández", dni: "89012345" },
    { nombre: "José Ramírez", dni: "90123456" },
    { nombre: "Elena Castro", dni: "9999" },
    { nombre: "Sofía López", dni: "98765432" },
    { nombre: "Miguel González", dni: "87654321" },
    { nombre: "Carmen Ruiz", dni: "76543210" },
    { nombre: "Jorge Soto ", dni: "65432109" },
    { nombre: "Patricia Rojas", dni: "54321098" },
    { nombre: "Manuel Silva", dni: "43210987" },
    { nombre: "Rosa Pérez", dni: "32109876" },
    { nombre: "Javier López", dni: "21098765" },
    { nombre: "Marina Torres", dni: "10987654" },
    { nombre: "Fernando Gómez", dni: "09876543" },
    { nombre: "Gabriela Sánchez", dni: "98765432" },
    { nombre: "Andrés Díaz", dni: "87654321" },
    { nombre: "Valeria Martínez", dni: "76543210" },
    { nombre: "Ramiro Fernández", dni: "65432109" },
    { nombre: "Sara Ramírez", dni: "54321098" },
    { nombre: "Diego Castro", dni: "43210987" },
    { nombre: "Carolina López", dni: "32109876" },
    { nombre: "Mariano Silva", dni: "21098765" },
    { nombre: "Liliana Pérez", dni: "10987654" },
    { nombre: "Gustavo López", dni: "09876543" },
  ];

  try {
    await Estudiante.insertMany(estudiantes);
  } catch (error) {
    console.error(
      "Estudiantes. Error al cargar datos de ejemplo:",
      error.message
    );
  }

  // Carga docentes
  const docentes = [
    { nombre: "Luis Rodriguez", dni: "123456" },
    { nombre: "Jesus María Gónzalez", dni: "234567" },
    { nombre: "Luisa Díaz", dni: "345678" },
    { nombre: "Ana Quiroga", dni: "4444" },
    { nombre: "Martín Sánchez", dni: "567890" },
    { nombre: "Pedro Díaz", dni: "678901" },
    { nombre: "Jorge Martínez", dni: "789012" },
    { nombre: "Lucía Rivero", dni: "890123" },
    { nombre: "Juan Dominguez", dni: "901234" },
    { nombre: "Elena Quintana", dni: "012345" },
  ];
  try {
    await Docente.insertMany(docentes);
  } catch (error) {
    console.error("Docentes. Error al cargar datos de ejemplo:", error.message);
  }

  // Carga un usuario admin, y los usuarios asociados a estudiantes y docentes
  const listaEstudiantes = await Estudiante.find();
  const listaDocentes = await Docente.find();
  const listaRoles = await Rol.find();
  const usuarios = [
    {
      nombre: "admin",
      password: hashPassword("admin"),
      rol: listaRoles[0]._id,
      estudiante: null,
      docente: null,
    },
  ];

  listaEstudiantes.forEach((estudiante, index) => {
    usuarios.push({
      nombre: estudiante.dni,
      password: hashPassword(estudiante.dni),
      rol: listaRoles[2]._id,
      estudiante: estudiante._id,
      docente: null,
    });
  });

  listaDocentes.forEach((docente, index) => {
    usuarios.push({
      nombre: docente.dni,
      password: hashPassword(docente.dni),
      rol: listaRoles[1]._id,
      estudiante: null,
      docente: docente._id,
    });
  });

  try {
    await Usuario.insertMany(usuarios);
  } catch (error) {
    console.error("Usuarios. Error al cargar datos de ejemplo:", error.message);
  }

  // Carga cursos
  const cursos = [
    {
      nombre: "Matemática",
      docentes: [listaDocentes[0]._id, listaDocentes[2]._id],
      estudiantes: [
        { estudiante: listaEstudiantes[0]._id, calificacion: 8 },
        { estudiante: listaEstudiantes[1]._id, calificacion: 7 },
        { estudiante: listaEstudiantes[2]._id, calificacion: 9 },
        { estudiante: listaEstudiantes[3]._id, calificacion: 6 },
        { estudiante: listaEstudiantes[4]._id, calificacion: 7 },
        { estudiante: listaEstudiantes[9]._id, calificacion: 2 },
      ],
    },
    {
      nombre: "Lengua",
      docentes: [
        listaDocentes[2]._id,
        listaDocentes[3]._id,
        listaDocentes[4]._id,
      ],
      estudiantes: [
        { estudiante: listaEstudiantes[5]._id, calificacion: 9 },
        { estudiante: listaEstudiantes[6]._id, calificacion: 8 },
        { estudiante: listaEstudiantes[7]._id, calificacion: 7 },
        { estudiante: listaEstudiantes[8]._id, calificacion: 6 },
        { estudiante: listaEstudiantes[9]._id, calificacion: 5 },
      ],
    },
    {
      nombre: "Historia",
      docentes: [listaDocentes[3]._id, listaDocentes[5]._id],
      estudiantes: [
        { estudiante: listaEstudiantes[10]._id, calificacion: 7 },
        { estudiante: listaEstudiantes[11]._id, calificacion: 6 },
        { estudiante: listaEstudiantes[12]._id, calificacion: 8 },
        { estudiante: listaEstudiantes[13]._id, calificacion: 9 },
        { estudiante: listaEstudiantes[14]._id, calificacion: 7 },
        { estudiante: listaEstudiantes[9]._id, calificacion: 8 },
      ],
    },
  ];

  try {
    await Curso.insertMany(cursos);
  } catch (error) {
    console.error("Cursos. Error al cargar datos de ejemplo:", error.message);
  }

  console.log("Datos de ejemplo cargados");
}
