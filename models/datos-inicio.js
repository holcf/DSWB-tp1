import { Curso, Estudiante, Docente, Rol, Usuario } from "./models.js";

export async function cargarDatosInicio() {
  console.log("Cargando datos de ejemplo...");
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
    { nombre: "Elena Castro", dni: "01234567" },
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

  const docentes = [
    { nombre: "Juan Pérez", dni: "123456" },
    { nombre: "María Gómez", dni: "234567" },
    { nombre: "Luis Rodríguez", dni: "345678" },
    { nombre: "Ana Torres", dni: "456789" },
    { nombre: "Carlos Sánchez", dni: "567890" },
    { nombre: "Laura Díaz", dni: "678901" },
    { nombre: "Pedro Martínez", dni: "789012" },
    { nombre: "Lucía Fernández", dni: "890123" },
    { nombre: "José Ramírez", dni: "901234" },
    { nombre: "Elena Castro", dni: "012345" },
  ];
  try {
    await Docente.insertMany(docentes);
  } catch (error) {
    console.error("Docentes. Error al cargar datos de ejemplo:", error.message);
  }

  const listaEstudiantes = await Estudiante.find();
  const listaDocentes = await Docente.find();
  const listaRoles = await Rol.find();
  const usuarios = [
    {
      nombre: "admin",
      password: "admin",
      rol: listaRoles[0]._id,
      estudiante: null,
      docente: null,
    },
    {
      nombre: "docente",
      password: "docente",
      rol: listaRoles[1]._id,
      estudiante: null,
      docente: null,
    },
    {
      nombre: "estudiante",
      password: "estudiante",
      rol: listaRoles[2]._id,
      estudiante: null,
      docente: null,
    },
  ];

  listaEstudiantes.forEach((estudiante, index) => {
    usuarios.push({
      nombre: estudiante.dni,
      password: estudiante.dni,
      rol: listaRoles[2]._id,
      estudiante: estudiante._id,
      docente: null,
    });
  });

  listaDocentes.forEach((docente, index) => {
    usuarios.push({
      nombre: docente.dni,
      password: docente.dni,
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
      docentes: [listaDocentes[4]._id, listaDocentes[5]._id],
      estudiantes: [
        { estudiante: listaEstudiantes[10]._id, calificacion: 7 },
        { estudiante: listaEstudiantes[11]._id, calificacion: 6 },
        { estudiante: listaEstudiantes[12]._id, calificacion: 8 },
        { estudiante: listaEstudiantes[13]._id, calificacion: 9 },
        { estudiante: listaEstudiantes[14]._id, calificacion: 7 },
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
