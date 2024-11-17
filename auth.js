import { SignJWT } from "jose";
import { jwtVerify } from "jose/jwt/verify";
import crypto from "node:crypto";
import { Curso } from "./models/models.js";

/**
 * Middleware para verificar el token de autenticación.
 */
export async function verifyToken(req, res, next) {
  // obtenemos el token de la cookie
  let token = req.cookies?.token;
  if (token) {
    try {
      // verificamos el token y colocamos los datos del usuario en el body
      let response = await jwtVerify(token, getSecretKey());
      req.body.payload = response.payload;

      // si se ingreso a la raíz redirigimos al menú
      // sino dejamos pasar a la ruta solicitada
      if (req.url === "/") {
        res.redirect("/menu");
      } else {
        next();
      }
    } catch (error) {
      console.log("Error al verificar token:", error);
      res.clearCookie("token");
      res.redirect("/");
    }
  } else if (req.url.includes("/api")) {
    console.log("No Autorizado");
    res.status(401).json({ error: "No Autorizado" });
  }
  // si no hay token y la request no viene del login redirigimos al login
  // si no viene del token continúa (para evitar un loop)
  else if (req.url !== "/") {
    console.log("Redirecting to /");
    res.redirect("/");
  } else {
    next();
  }
}

/**
 * Función para crear un nuevo token de autenticación.
 */
export async function createToken(payload, secretKey) {
  let expirationTime = "1h";
  if (payload?.rememberMe) {
    expirationTime = "30d";
  }
  const newToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secretKey);
  return newToken;
}

/**
 * Función para hashear una contraseña
 */
export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Función para obtener la clave secreta o generarla si no existe.
 */
export function getSecretKey() {
  /** @type {Uint8Array} */
  let secretKey;
  let defaultSecretKey = new Uint8Array([
    67, 244, 60, 38, 250, 245, 166, 210, 23, 32, 189, 99, 84, 215, 248, 171, 39,
    248, 170, 104, 87, 33, 21, 59, 58, 199, 43, 138, 105, 46, 38, 22,
  ]);
  if (process.env.SECRET_KEY) {
    const secretKeyArray = process.env.SECRET_KEY.split(",").map(Number);
    secretKey = new Uint8Array(secretKeyArray);
    if (secretKey instanceof Uint8Array === false || secretKey.length !== 32) {
      console.error("Secret Key inválida. Por favor revise su archivo .env");
      //console.log("Usando secret key predeterminada.");
      return defaultSecretKey;
    } else {
      //console.log("Usando secret key presente en archivo .env");

      return secretKey;
    }
  } else {
    //console.error("No hay secret key en el archivo .env");
    //console.log("Usando secret key predeterminada.");
    return defaultSecretKey;
  }
}

/**
 * Middleware para verificar si el usuario es administrador.
 */
export function verifyAdmin(req, res, next) {
  if (req.body.payload.usuario.rol.nombre === "administrador") {
    next();
  } else {
    res.status(401).json({ error: "No Autorizado" });
  }
}

/**
 * Middleware para verificar si el usuario es un estudiante que coincide con
 * el id de la ruta.
 * También permite el acceso a un administrador.
 */
export function verifyEstudiante(req, res, next) {
  if (
    req.body.payload.usuario.estudiante === req.params.id ||
    req.body.payload.usuario.rol.nombre === "administrador"
  ) {
    next();
  } else {
    res.status(401).json({ error: "No Autorizado" });
  }
}

/**
 * Middleware para verificar si el usuario es un docente o administrador.
 */
export function verifyListaCursos(req, res, next) {
  if (
    req.body.payload.usuario.rol.nombre === "administrador" ||
    req.body.payload.usuario.rol.nombre === "docente"
  ) {
    next();
  } else {
    res.status(401).json({ error: "No Autorizado" });
  }
}

/**
 * Middleware para verificar si el usuario es un docente del curso.
 * También permite el acceso a un administrador.
 */
export async function verifyEdicionCurso(req, res, next) {
  let curso = await Curso.findById(req.params.id);

  let auth = false;
  curso.docentes.forEach((docente) => {
    if (docente.toString() == req.body.payload.usuario.docente) {
      auth = true;
    }
  });

  if (req.body.payload.usuario.rol.nombre === "administrador" || auth) {
    next();
  } else {
    res.status(401).json({ error: "No Autorizado" });
  }
}
