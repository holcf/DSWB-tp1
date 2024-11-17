// cursos.controller.test.js
import { describe, test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { Curso } from "../models/models.js";
import {
  apiNuevoCurso,
  apiListarCursos,
  apiEditarNotasCurso,
} from "./api-curso-controller.js";

describe("API Curso Controller", () => {
  // Mock del modelo Curso
  vi.mock("../models/models.js", () => ({
    Curso: vi.fn().mockImplementation((data) => ({
      ...data,
      save: vi.fn().mockResolvedValue(undefined),
    })),
  }));

  const app = express();
  app.use(express.json());
  app.post("/api/cursos/nuevo", apiNuevoCurso);
  app.get("/api/cursos/lista", apiListarCursos);
  app.put("/api/cursos/editar/:id", apiEditarNotasCurso);

  beforeEach(() => {
    vi.clearAllMocks();

    // mock de los métodos estáticos de Curso
    Curso.findOne = vi.fn();
    Curso.find = vi.fn();
    Curso.findById = vi.fn();
  });

  describe("POST /api/cursos/nuevo (apiNuevoCurso)", () => {
    test("debería crear un nuevo curso con un solo estudiante", async () => {
      Curso.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/cursos/nuevo")
        .send({
          nombre: "Matemáticas",
          estudiantes: "123",
          docentes: "456",
        })
        .expect(201);

      expect(response.body).toEqual({
        message: "Curso guardado con éxito",
      });

      // Verificamos que se llamó al constructor con los datos correctos
      expect(Curso).toHaveBeenCalledWith({
        nombre: "Matemáticas",
        estudiantes: [{ estudiante: "123" }],
        docentes: ["456"],
      });
    });

    test("debería crear un nuevo curso con múltiples estudiantes", async () => {
      Curso.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/cursos/nuevo")
        .send({
          nombre: "Matemáticas",
          estudiantes: ["123", "456"],
          docentes: ["789", "012"],
        })
        .expect(201);

      expect(Curso).toHaveBeenCalledWith({
        nombre: "Matemáticas",
        estudiantes: [
          { estudiante: "123", calificacion: null },
          { estudiante: "456", calificacion: null },
        ],
        docentes: ["789", "012"],
      });
    });

    test("debería rechazar curso con nombre duplicado", async () => {
      Curso.findOne.mockResolvedValue({ nombre: "Matemáticas" });

      const response = await request(app)
        .post("/api/cursos/nuevo")
        .send({
          nombre: "Matemáticas",
          estudiantes: ["123"],
          docentes: ["456"],
        })
        .expect(400);

      expect(response.body).toEqual({
        error: "Ya existe un curso con ese nombre.",
      });
    });
  });

  describe("GET /api/cursos/lista (apiListarCursos)", () => {
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

      const response = await request(app).get("/api/cursos/lista").expect(200);

      expect(response.body).toEqual(mockCursos);
    });

    test("debería manejar errores al listar cursos", async () => {
      Curso.find.mockImplementation(() => {
        throw new Error("DB Error");
      });

      await request(app).get("/api/cursos/lista").expect(500).expect({
        error: "Error interno del servidor",
      });
    });
  });

  describe("PUT /api/cursos/editar/:id (apiEditarNotasCurso)", () => {
    test("debería actualizar notas correctamente", async () => {
      const mockCurso = {
        _id: "1",
        estudiantes: [],
        save: vi.fn().mockResolvedValue(undefined),
      };

      Curso.findById.mockResolvedValue(mockCurso);

      const response = await request(app)
        .put("/api/cursos/editar/1")
        .send({
          estudianteId: ["123", "456"],
          calificacion: ["85", "90"],
        })
        .expect(200);

      expect(response.body).toEqual({
        message: "Notas guardadas con éxito",
      });

      // Verificamos que se guardaron las calificaciones correctamente
      expect(mockCurso.estudiantes).toEqual([
        { estudiante: "123", calificacion: 85 },
        { estudiante: "456", calificacion: 90 },
      ]);
      expect(mockCurso.save).toHaveBeenCalled();
    });

    test("debería manejar curso no encontrado", async () => {
      Curso.findById.mockResolvedValue(null);

      await request(app)
        .put("/api/cursos/editar/1")
        .send({
          estudianteId: ["123"],
          calificacion: ["85"],
        })
        .expect(404)
        .expect({
          error: "Curso no encontrado",
        });
    });

    test("debería validar datos incompletos", async () => {
      Curso.findById.mockResolvedValue({
        _id: "1",
        estudiantes: [],
      });

      await request(app)
        .put("/api/cursos/editar/1")
        .send({
          estudianteId: ["123"], // Sin calificaciones
        })
        .expect(400)
        .expect({
          error: "Datos incompletos",
        });
    });
  });
});
