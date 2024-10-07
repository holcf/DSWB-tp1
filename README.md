# TP1

## Usuarios de prueba

Para ingresar al sistema, se pueden utilizar los siguientes usuarios de prueba:

- "admin"
- "docente"
- "estudiante"

La contraseña es la misma que el nombre de usuario.

## Sobre el funcionamiento del login, menu y usuarios.

El login se realiza con el nombre de usuario y contraseña. Cada usuario tiene asociado un rol en el sistema ("administrador", docente" o "estudiante"). Dependiendo del rol, se mostrarán diferentes opciones en el menú.
A la vista del menu la mostramos con un render para poder pasarle el usuario logueado, ya que si hicieramos un `redirect` no podriamos pasarle el usuario si utilizar sesiones o cookies (se podrían pasar mediante query params pero es una técnica insegura, y tampoco tiene sentido utilizar otras técnicas más engorrosas como redireccionar mediante un post a otra página si luego vamos a implementar sesiones).

En cuanto a los usuarios, más allá de los de prueba, y considerando cómo podría funcionar el sistema en un entorno real, nuestra idea es que no haya un registro de usuarios, sino que los usuarios se crean al momento en que la administración hace un alta de un docente o de un estudiante y crea un usuario para cada uno de ellos (con el DNI como nombre de usuario y contraseña -la cual luego es cambiada por el usuario-).
