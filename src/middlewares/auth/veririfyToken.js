import { ResponseProvider } from "../../providers/ResponseProvider.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return ResponseProvider.error(res, "Error en el token", 401, "Token inválido");

    next();
}