const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usuario = require("../models/usuarios");

router.post("/login", async (req, res) => {
  const { correo, password } = req.body;

  // Validar que ambos campos estén presentes
  if (!correo || !password) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  // Buscar al usuario en la base de datos por correo
  const usuarios = await usuario.findOne({ correo });
  if (!usuarios) {
    return res.status(401).json({ mensaje: "Usuario no registrado" });
  }
  // Verificar si el estado del usuario es "true"
  if (usuarios.estado === "true") {
    // Comparar el hash de la contraseña almacenada con la proporcionada
    const isMatch = await bcrypt.compare(password, usuarios.password);
    if (!isMatch) {
      return res.status(401).json({ mensaje: "Contraseña Incorrecta" });
    }

    // Generar un token JWT
    const token = await jwt.sign({ _: usuarios._id }, "secretkey", {
      expiresIn: 86400, // Expira en 24 horas
    });

    return res.status(200).json({ token });

  } else {
    return res.status(401).json({ mensaje: "Inicio de sesión no autorizado" });
  }
});

module.exports = router;
