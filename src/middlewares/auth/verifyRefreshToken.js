import { ResponseProvider } from "../../providers/ResponseProvider.js";
import jwt from 'jsonwebtoken';

const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

export const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) return ResponseProvider.error(res, "Token no encontrado", 401, "TOKEN_MISSING");

    try {
        const decoded = jwt.verify(refreshToken, refreshSecretKey);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return ResponseProvider.error(res, 'Token expirado', 401, 'TOKEN_EXPIRED');
        }
        console.log(err);
        
        return ResponseProvider.error(res, 'Token inválido', 401, 'TOKEN_INVALID');
    }
}