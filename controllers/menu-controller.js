/**
 * Controlador para mostrar el menú basado en el rol del usuario
 */
export const mostrarMenu = (req, res) => {
  //TODO: pendiente a implementar cuando esté resulto el tema de la session
  /*   console.log("--en menu req.usuario--", req.usuario);
  if (!req.usuario) {
    return res.redirect("/login");
  } */
  /*   const rol = req.usuario.rol.nombre;
  console.log("rol--", rol); */
  const rol = { usuario: { rol: { nombre: "administrador" } } };
  res.render("menu", rol);
};
