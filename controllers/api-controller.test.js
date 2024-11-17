import { describe, test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { Usuario } from "../models/models.js";
import { hashPassword, createToken, getSecretKey } from "../auth.js";
import { apiLogin, apiLogout } from "./api-controller.js";

describe("api-controller tests", () => {
  // Mocks
  vi.mock("../models/models.js", () => ({
    Usuario: {
      findOne: vi.fn(),
    },
  }));

  vi.mock(import("../auth.js"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      hashPassword: vi.fn((pass) => `hashed_${pass}`),
      createToken: vi.fn(() => "mock_token"),
      getSecretKey: vi.fn(() => "test_secret"),
    };
  });

  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.post("/api/login", apiLogin);
  app.get("/api/logout", apiLogout);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/login", () => {
    test("debería hacer login exitoso y devolver token", async () => {
      const mockUsuario = {
        _id: "1",
        nombre: "test",
        rol: { _id: "rol1", nombre: "user" },
      };

      Usuario.findOne.mockImplementation(() => ({
        populate: vi.fn().mockResolvedValue(mockUsuario),
      }));

      const response = await request(app)
        .post("/api/login")
        .send({
          nombre: "test",
          password: "password123",
          rememberMe: false,
        })
        .expect("Content-Type", /json/)
        .expect(200);

      // Verificamos respuesta
      expect(response.body).toEqual({
        message: "Login exitoso",
        payload: { usuario: mockUsuario },
      });

      // Verificamos cookie
      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=/);
      expect(cookies[0]).toMatch(/HttpOnly/);
      expect(cookies[0]).toMatch(/SameSite=Strict/);

      // Verificamos llamadas a los mocks
      expect(Usuario.findOne).toHaveBeenCalledWith({
        nombre: "test",
        password: "hashed_password123",
      });
      expect(createToken).toHaveBeenCalledWith(
        {
          usuario: mockUsuario,
          rememberMe: null,
        },
        "test_secret"
      );
    });

    test("debería manejar remember me correctamente", async () => {
      const mockUsuario = {
        _id: "1",
        nombre: "test",
        rol: { _id: "rol1", nombre: "user" },
      };

      Usuario.findOne.mockImplementation(() => ({
        populate: vi.fn().mockResolvedValue(mockUsuario),
      }));

      const response = await request(app)
        .post("/api/login")
        .send({
          nombre: "test",
          password: "password123",
          rememberMe: true,
        })
        .expect(200);

      // Verificar cookie con remember me
      const cookies = response.headers["set-cookie"];
      expect(cookies[0]).toMatch(/Max-Age=2592000/); // 30 días en segundos
    });

    test("debería devolver 401 si las credenciales son inválidas", async () => {
      Usuario.findOne.mockImplementation(() => ({
        populate: vi.fn().mockResolvedValue(null),
      }));

      const response = await request(app)
        .post("/api/login")
        .send({
          nombre: "test",
          password: "wrong_password",
        })
        .expect(401);

      expect(response.body).toEqual({
        error: "Usuario o contraseña incorrectos",
      });
    });

    test("debería manejar errores internos", async () => {
      Usuario.findOne.mockImplementation(() => {
        throw new Error("DB Error");
      });

      const response = await request(app)
        .post("/api/login")
        .send({
          nombre: "test",
          password: "password123",
        })
        .expect(500);

      expect(response.body).toEqual({
        error: "Error interno del servidor",
      });
    });

    test("debería validar campos requeridos", async () => {
      await request(app).post("/api/login").send({}).expect(500);
    });
  });

  describe("GET /api/logout", () => {
    test("debería hacer logout exitosamente", async () => {
      const response = await request(app).get("/api/logout").expect(200);

      // Verificamos respuesta
      expect(response.body).toEqual({
        message: "Logout exitoso",
      });

      // Verificamos que la cookie token se elimina
      const cookies = response.headers["set-cookie"];
      expect(cookies[0]).toMatch(/token=;/);
      expect(cookies[0]).toMatch(/Expires=Thu, 01 Jan 1970/);
    });
  });
});
