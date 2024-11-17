import { describe, test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { Docente, Estudiante, Curso } from "../models/models.js";
import {
  nuevoCurso,
  postNuevoCurso,
  listarCursos,
  editarNotasCurso,
  postEditarNotasCurso,
} from "./curso-controller.js";
import { fileURLToPath } from "url";
import path from "path";

describe("Curso Controller", () => {
  // Mock del modelo Curso, Docente y Estudiante
  vi.mock("../models/models.js", () => ({
    Curso: vi.fn().mockImplementation((data) => ({
      ...data,
      save: vi.fn().mockResolvedValue(undefined),
    })),
    Docente: {
      find: vi.fn(),
    },
    Estudiante: {
      find: vi.fn(),
    },
  }));

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "public")));
  app.set("view engine", "pug");
  app.set("views", "./views");

  app.get("/cursos/nuevo", nuevoCurso);
  app.post("/cursos/nuevo", postNuevoCurso);
  app.get("/cursos/lista", listarCursos);
  app.get("/cursos/editar/:id", editarNotasCurso);
  app.post("/cursos/editar/:id", postEditarNotasCurso);

  beforeEach(() => {
    vi.clearAllMocks();

    // mock de los métodos estáticos de Curso
    Curso.findOne = vi.fn();
    Curso.find = vi.fn();
    Curso.findById = vi.fn();
  });

  describe("GET /cursos/nuevo (nuevoCurso)", () => {
    test("debería obtener docentes y estudiantes para el formulario", async () => {
      Docente.find.mockResolvedValue([{ _id: "1", nombre: "Prof. García" }]);
      Estudiante.find.mockResolvedValue([{ _id: "1", nombre: "Juan" }]);

      const response = await request(app).get("/cursos/nuevo").expect(200);

      expect(response.text).toContain("Prof. García");
      expect(response.text).toContain("Juan");
    });

    test("debería manejar errores al obtener datos", async () => {
      Docente.find.mockImplementation(() => {
        throw new Error("DB Error");
      });

      await request(app)
        .get("/cursos/nuevo")
        .expect(500)
        .expect(/Error interno del servidor/);
    });
  });

  describe("POST /cursos/nuevo (postNuevoCurso)", () => {
    test("debería crear un nuevo curso con un solo estudiante", async () => {
      Curso.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/cursos/nuevo")
        .send({
          nombre: "Matemáticas",
          estudiantes: "123",
          docentes: "456",
        })
        .expect(200);

      expect(response.text).toContain("Curso guardardo con éxito");

      // Verificamos que se llamó al constructor con los datos correctos
      expect(Curso).toHaveBeenCalledWith({
        nombre: "Matemáticas",
        estudiantes: [{ estudiante: "123" }],
        docentes: ["456"],
      });
    });

    test("debería rechazar curso con nombre duplicado", async () => {
      Curso.findOne.mockResolvedValue({ nombre: "Matemáticas" });

      const response = await request(app)
        .post("/cursos/nuevo")
        .send({
          nombre: "Matemáticas",
          estudiantes: ["123"],
          docentes: ["456"],
        })
        .expect(200);

      expect(response.text).toContain(
        "No se guardo el curso nuevo. Ya existe uno con ese nombre."
      );
    });
  });

  describe("GET /cursos/lista (listarCursos)", () => {
    test("debería listar todos los cursos", async () => {
      const mockCursos = [
        {
          _id: "1",
          nombre: "Matemáticas",
          estudiantes: [
            { estudiante: { _id: "123", nombre: "Juan" }, calificacion: null },
          ],
          docentes: [{ _id: "456", nombre: "Prof. García" }],
        },
      ];

      Curso.find.mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockCursos),
      });

      const response = await request(app).get("/cursos/lista").expect(200);

      expect(response.text).toContain("Matemáticas");
      expect(response.text).toContain("Juan");
      expect(response.text).toContain("Prof. García");
    });

    test("debería manejar errores al listar cursos", async () => {
      Curso.find.mockImplementation(() => {
        throw new Error("DB Error");
      });

      await request(app)
        .get("/cursos/lista")
        .expect(500)
        .expect(/Error interno del servidor/);
    });
  });

  describe("GET /cursos/editar/:id (editarNotasCurso)", () => {
    test("debería obtener curso para editar notas", async () => {
      const mockCurso = {
        _id: "1",
        nombre: "Matemáticas",
        estudiantes: [
          { estudiante: { _id: "123", nombre: "Juan" }, calificacion: 85 },
        ],
        docentes: [{ _id: "456", nombre: "Prof. García" }],
      };

      Curso.findById.mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockCurso),
      });

      const response = await request(app).get("/cursos/editar/1").expect(200);

      expect(response.text).toContain("Matemáticas");
      expect(response.text).toContain("Juan");
      expect(response.text).toContain("Prof. García");
    });

    test("debería manejar errores al obtener curso", async () => {
      Curso.findById.mockImplementation(() => {
        throw new Error("DB Error");
      });

      await request(app)
        .get("/cursos/editar/1")
        .expect(500)
        .expect(/Error interno del servidor/);
    });
  });

  describe("POST /cursos/editar/:id (postEditarNotasCurso)", () => {
    test("debería actualizar notas correctamente", async () => {
      const mockCurso = {
        _id: "1",
        estudiantes: [
          { estudiante: "123", calificacion: 85 },
          { estudiante: "456", calificacion: 90 },
        ],
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue({}),
      };

      Curso.findById.mockReturnValue(mockCurso);
      Curso.findById.mockReturnValue(mockCurso);

      const response = await request(app)
        .post("/cursos/editar/1")
        .send({
          estudianteId: ["123", "456"],
          calificacion: ["85", "90"],
        })
        .expect(200);

      // Verificamos que se llamó a res.render con los argumentos correctos y devolvio la vista correcta
      expect(response.text).toContain("Notas guardadas");

      // Verificamos que se guardaron las calificaciones correctamente
      expect(mockCurso.estudiantes).toEqual([
        { estudiante: "123", calificacion: 85 },
        { estudiante: "456", calificacion: 90 },
      ]);
      expect(mockCurso.save).toHaveBeenCalled();
    });

    test("debería manejar curso no encontrado", async () => {
      Curso.findById.mockResolvedValue(null);

      const response = await request(app)
        .post("/cursos/editar/1")
        .send({
          estudianteId: ["123"],
          calificacion: ["85"],
        })
        .expect(404);

      expect(response.text).toContain("Curso no encontrado");
    });

    test("debería validar datos incompletos", async () => {
      Curso.findById.mockResolvedValue({
        _id: "1",
        estudiantes: [],
      });

      const response = await request(app)
        .post("/cursos/editar/1")
        .send({
          estudianteId: ["123"], // Sin calificaciones
        })
        .expect(400);

      expect(response.text).toContain("Datos incompletos");
    });
  });
});
