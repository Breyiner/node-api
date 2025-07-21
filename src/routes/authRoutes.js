import express from "express";
import {
  register,
  login,
  logout,
} from "../controllers/authController.js";
import {
  camposLogin,
  camposRegistro,
} from "../middlewares/auth/index.js";
import { verifyToken } from "../middlewares/auth/veririfyToken.js";

const router = express.Router();

// Registro de usuario
router.post("/register", camposRegistro, register);

// Inicio de sesión
router.post("/login", camposLogin, login);

// Ruta para refrescar el token del usuario autenticado, falta el middleware de verificación del token de refresco


// Logout
router.get("/logout", verifyToken, logout);

// Faltan las rutas para recuperar la contraseña y verificar el email

export default router;
