import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
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

const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock de Curso.findById
vi.mock("./models/models.js", () => ({
  Curso: {
    findById: vi.fn(),
  },
}));

describe("Funciones de autenticación", () => {
  describe("hashPassword", () => {
    it("debe generar un hash consistente para la misma contraseña", () => {
      const password = "miContraseña123";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produce un hash de 64 caracteres
    });

    it("debe generar diferentes hashes para diferentes contraseñas", () => {
      const password1 = "contraseña1";
      const password2 = "contraseña2";

      expect(hashPassword(password1)).not.toBe(hashPassword(password2));
    });
  });

  describe("createToken", () => {
    it("debe crear un token válido con expiración de 1 hora por defecto", async () => {
      const payload = { userId: 1, username: "test" };
      const secretKey = getSecretKey();

      const token = await createToken(payload, secretKey);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // formato JWT válido

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      const diff = exp - now;
      const lessThan2hs = diff < 120 * 60;
      expect(lessThan2hs).toBe(true);
    });

    it("debe crear un token con expiración de 30 días si rememberMe es true", async () => {
      const payload = { userId: 1, username: "test", rememberMe: true };
      const secretKey = getSecretKey();

      const token = await createToken(payload, secretKey);
      expect(typeof token).toBe("string");

      //verify expiration date
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      const diff = exp - now;
      const greaterThan29 = diff > 29 * 24 * 60 * 60;
      expect(greaterThan29).toBe(true);
    });
  });

  describe("verifyToken middleware", () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
      mockReq = {
        cookies: {},
        url: "/",
        body: {},
      };
      mockRes = {
        redirect: vi.fn(),
        clearCookie: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      nextFunction = vi.fn();
    });

    it("debe redirigir a /menu si el token es válido y la URL es /", async () => {
      const payload = { userId: 1 };
      const token = await createToken(payload, getSecretKey());
      mockReq.cookies.token = token;

      await verifyToken(mockReq, mockRes, nextFunction);

      expect(mockRes.redirect).toHaveBeenCalledWith("/menu");
    });

    it("debe llamar next() si el token es válido y la URL no es /", async () => {
      const payload = { userId: 1 };
      const token = await createToken(payload, getSecretKey());
      mockReq.cookies.token = token;
      mockReq.url = "/dashboard";

      await verifyToken(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("debe redirigir a / si no hay token y la URL no es /", async () => {
      mockReq.url = "/dashboard";

      await verifyToken(mockReq, mockRes, nextFunction);

      expect(mockRes.redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("Middlewares de autorización", () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
      mockReq = {
        body: {
          payload: {
            usuario: {
              rol: { nombre: "" },
              estudiante: "",
              docente: "",
            },
          },
        },
        params: {},
      };
      mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      nextFunction = vi.fn();
    });

    describe("verifyAdmin", () => {
      it("debe permitir acceso si el usuario es administrador", () => {
        mockReq.body.payload.usuario.rol.nombre = "administrador";

        verifyAdmin(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });

      it("debe denegar acceso si el usuario no es administrador", () => {
        mockReq.body.payload.usuario.rol.nombre = "estudiante";

        verifyAdmin(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "No Autorizado" });
      });
    });

    describe("verifyEstudiante", () => {
      it("debe permitir acceso si el ID coincide con el estudiante", () => {
        mockReq.body.payload.usuario.estudiante = "123";
        mockReq.params.id = "123";

        verifyEstudiante(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });

      it("debe permitir acceso si el usuario es administrador", () => {
        mockReq.body.payload.usuario.rol.nombre = "administrador";
        mockReq.params.id = "123";

        verifyEstudiante(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });
    });

    describe("verifyListaCursos", () => {
      it("debe permitir acceso a docentes", () => {
        mockReq.body.payload.usuario.rol.nombre = "docente";

        verifyListaCursos(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });

      it("debe permitir acceso a administradores", () => {
        mockReq.body.payload.usuario.rol.nombre = "administrador";

        verifyListaCursos(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });

      it("debe denegar acceso a otros roles", () => {
        mockReq.body.payload.usuario.rol.nombre = "estudiante";

        verifyListaCursos(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "No Autorizado" });
      });
    });

    describe("verifyEdicionCurso", () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it("debe permitir acceso si el usuario es docente del curso", async () => {
        mockReq.body.payload.usuario.docente = "123";
        mockReq.params.id = "curso1";

        Curso.findById.mockResolvedValue({
          docentes: ["123"],
        });

        await verifyEdicionCurso(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });

      it("debe permitir acceso si el usuario es administrador", async () => {
        mockReq.body.payload.usuario.rol.nombre = "administrador";
        mockReq.params.id = "curso1";

        Curso.findById.mockResolvedValue({
          docentes: ["456"],
        });

        await verifyEdicionCurso(mockReq, mockRes, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
      });

      it("debe denegar acceso si el usuario no es docente del curso ni administrador", async () => {
        mockReq.body.payload.usuario.docente = "789";
        mockReq.body.payload.usuario.rol.nombre = "docente";
        mockReq.params.id = "curso1";

        Curso.findById.mockResolvedValue({
          docentes: ["123", "456"],
        });

        await verifyEdicionCurso(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "No Autorizado" });
      });
    });
  });
});
