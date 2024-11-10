# Grupo ondaViñasLopezHolc - Desarrollo de Sistemas Web (Back End) - 2° B - 2024

## Cambios realizados para la segunda entrega

- Utilización de cookies y JWT para la autenticación de usuarios
- Middleware para verificar la autenticación de usuarios y redireccionamiento.
- Opción "Recordarme" en el login para cambiar la duración de la cookie/token (1 hora si no se selecciona, 30 días si se selecciona)
- Hash de contraseñas
- API endpoints para las funciones de la aplicación (login, logout, alta de docentes, alta de estudiantes, alta de cursos, consulta de cursos, consulta de estudiantes, edición de notas del curso) para que puedan ser consumidas desde un frontend.
- Middlewares en las rutas de las APIs, para verificar que el usuario que intenta acceder a un recurso tiene los permisos necesarios según su rol.

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
