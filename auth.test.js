import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import {
  verifyToken,
  createToken,
  hashPassword,
  getSecretKey,
  verifyAdmin,
  verifyEstudiante,
  verifyListaCursos,
  verifyEdicionCurso,
} from "./auth.js";
import { Curso } from "./models/models.js";

describe("Funciones de autenticación", () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Mock de Curso.findById
  vi.mock("./models/models.js", () => ({
    Curso: {
      findById: vi.fn(),
    },
  }));

  describe("hashPassword", () => {
    test("debe generar un hash consistente para la misma contraseña", () => {
      const password = "miContraseña123";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    test("debe generar diferentes hashes para diferentes contraseñas", () => {
      const password1 = "contraseña1";
      const password2 = "contraseña2";

      expect(hashPassword(password1)).not.toBe(hashPassword(password2));
    });
  });

  describe("verifyToken middleware", () => {
    beforeEach(() => {
      app.get("/test", verifyToken, (req, res) => {
        res.json({ success: true });
      });

      app.get("/", verifyToken, (req, res) => {
        res.json({ success: true });
      });
    });

    test("debe redirigir a /menu si el token es válido y la URL es /", async () => {
      const payload = { userId: 1 };
      const token = await createToken(payload, getSecretKey());

      const response = await request(app)
        .get("/")
        .set("Cookie", [`token=${token}`]);

      expect(response.status).toBe(302);
      expect(response.header.location).toBe("/menu");
    });

    test("debe continuar si el token es válido y la URL no es /", async () => {
      const payload = { userId: 1 };
      const token = await createToken(payload, getSecretKey());

      const response = await request(app)
        .get("/test")
        .set("Cookie", [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("debe redirigir a / si no hay token", async () => {
      const response = await request(app).get("/test");

      expect(response.status).toBe(302);
      expect(response.header.location).toBe("/");
    });
  });

  describe("Middlewares de autorización", () => {
    beforeEach(() => {
      // Rutas de prueba
      app.get("/admin-test", verifyToken, verifyAdmin, (req, res) => {
        res.json({ success: true });
      });

      app.get("/estudiante/:id", verifyToken, verifyEstudiante, (req, res) => {
        res.json({ success: true });
      });

      app.get("/cursos", verifyToken, verifyListaCursos, (req, res) => {
        res.json({ success: true });
      });

      app.get(
        "/curso/:id/editar",
        verifyToken,
        verifyEdicionCurso,
        (req, res) => {
          res.json({ success: true });
        }
      );
    });

    describe("verifyAdmin", () => {
      test("debe permitir acceso si el usuario es administrador", async () => {
        const token = await createToken(
          {
            usuario: { rol: { nombre: "administrador" } },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/admin-test")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      test("debe denegar acceso si el usuario no es administrador", async () => {
        const token = await createToken(
          {
            usuario: { rol: { nombre: "estudiante" } },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/admin-test")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
      });
    });

    describe("verifyEstudiante", () => {
      test("debe permitir acceso si el ID coincide con el estudiante", async () => {
        const token = await createToken(
          {
            usuario: {
              estudiante: "123",
              rol: { nombre: "estudiante" },
            },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/estudiante/123")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      test("debe permitir acceso si el usuario es administrador", async () => {
        const token = await createToken(
          {
            usuario: { rol: { nombre: "administrador" } },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/estudiante/123")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    describe("verifyListaCursos", () => {
      test("debe permitir acceso a docentes", async () => {
        const token = await createToken(
          {
            usuario: { rol: { nombre: "docente" } },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/cursos")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      test("debe denegar acceso a estudiantes", async () => {
        const token = await createToken(
          {
            usuario: { rol: { nombre: "estudiante" } },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/cursos")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
      });
    });

    describe("verifyEdicionCurso", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      test("debe permitir acceso si el usuario es docente del curso", async () => {
        Curso.findById.mockResolvedValue({
          docentes: ["123"],
        });

        const token = await createToken(
          {
            usuario: {
              docente: "123",
              rol: { nombre: "docente" },
            },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/curso/cualquier-id/editar")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      test("debe denegar acceso si el usuario no es docente del curso", async () => {
        Curso.findById.mockResolvedValue({
          docentes: ["456"],
        });

        const token = await createToken(
          {
            usuario: {
              docente: "123",
              rol: { nombre: "docente" },
            },
          },
          getSecretKey()
        );

        const response = await request(app)
          .get("/curso/cualquier-id/editar")
          .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
      });
    });
  });
});
