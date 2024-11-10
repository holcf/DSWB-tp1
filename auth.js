import { SignJWT } from "jose";
import { jwtVerify } from "jose/jwt/verify";
import crypto from "crypto";

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
  }
  // si no hay token y la request no viene del login redirigimos al login
  // si no viene del token continúa (para evitar un loop)
  else if (req.url !== "/") {
    res.redirect("/");
  } else {
    next();
  }
}

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

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

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
