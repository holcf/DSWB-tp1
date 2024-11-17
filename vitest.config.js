import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  test: {
    include: ["**/*.test.js"], // Incluir solo archivos .test.js en la carpeta src
    exclude: ["**/*.spec.js", "node_modules/**/*.test.js"], // Excluir archivos .spec.js en la carpeta src
    environment: "node", // Asegurarse de que el entorno de prueba sea Node.js
  },
});
