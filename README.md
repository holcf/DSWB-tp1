# Grupo ondaViñasLopezHolc - Desarrollo de Sistemas Web (Back End) - 2° B - 2024

## Cambios realizados para la segunda entrega

- Utilización de cookies y JWT para la autenticación de usuarios
- Middleware para verificar la autenticación de usuarios y redireccionamiento.
- Opción "Recordarme" en el login para cambiar la duración de la cookie/token (1 hora si no se selecciona, 30 días si se selecciona)
- Hash de contraseñas
- API endpoints para las funciones de la aplicación (login, logout, alta de docentes, alta de estudiantes, alta de cursos, consulta de cursos, consulta de estudiantes, edición de notas del curso) para que puedan ser consumidas desde un frontend.
- Middlewares en las rutas de las APIs, para verificar que el usuario que intenta acceder a un recurso tiene los permisos necesarios según su rol.
- Testing con Vitest y SuperTest para: api-curso-controller.js, api-controller.js, curso-controller.js, y todas las funciones y middleware de autenticación presentes en auth.js. Elegimos Vitest en lugar de Jest dado que en nuestro proyecto utilizamos ESM Modules para importación en lugar de Common JS, y vimos en la documentación de Jest que solo tenían soporte experimental para ESM pero no recomendaban su utilización, en cambio Vitest soporta por defecto ESM y su API es casi la misma que Jest.
- No utilizamos websockets dado que nuestra aplicación no requería de un módulo de chat u otro tipo de comunicación sincrónica.
- Hicimos el deploy de la app en Render (https://dswb-tp1.onrender.com/). No logramos adaptarlo para que funcione en Vercel ya que nuestra app hace correr un servidor permanente y Vercel trabaja con serverless functions.

## Instalación

Instalar dependencias:

```bash
npm install
```

## Ejecución

Para ejecutar la aplicación con nodemon, se debe correr el siguiente comando:

```bash
npm run dev
```

Para ejecutar la aplicación con node, se debe correr el siguiente comando:

```bash
node app.js
```

## Prueba de la aplicación

Para ingresar al sistema, se pueden utilizar los siguientes usuarios/contraseña de prueba:

- "admin" / "admin" para acceder como administración
- "4444" / "4444" para acceder como una docente en particular
- "9999" / "9999" para acceder como una "estudiante" en particular

Para correr los tests con vitest: `npx vitest`.
