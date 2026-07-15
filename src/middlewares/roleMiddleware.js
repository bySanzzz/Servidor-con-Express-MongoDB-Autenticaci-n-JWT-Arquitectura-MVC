//Verifica el rol de usuario

const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRole = req.userLogged?.role

    if (!rolesPermitidos.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "No tenés permisos para realizar esta acción"
      })
    }

    next()
  }
}

export { requireRole }