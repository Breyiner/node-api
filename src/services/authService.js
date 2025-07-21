import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Usuario } from "../models/Usuario.js";

dotenv.config();

const secretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION;
const refreshExpiration = process.env.REFRESH_EXPIRATION;

class AuthService {
  /**
   *
   * @param {*} nombre
   * @param {*} email
   * @param {*} password
   * @returns
   */
  static async register(nombre, email, password) {
    try {
      // Verificar si el usuario ya existe
      const userExists = await Usuario.findByEmail(email);
      // Validamos si el correo ya esta registrado en la base de datos
      if (userExists)
        return { error: true, code: 401, message: "El corre ya se encuentra registrado en el sistema" };
      // Hashear la contraseña || encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      // Registramos el usuario en la base de datos
      const userId = await Usuario.create(nombre, email, hashedPassword);
      // Retornamos la respuesta
      return { error: false, code: 201, message: "Usuario creado" };
    } catch (error) {      
      console.log(error);
      
      return { error: true, code: 500, message: "Error al crear el usuario" };
    }
  }
  /**
   *
   * @param {*} email
   * @param {*} password
   * @returns
   */
  static async login(res, email, password) {
    try {
      // Consultamos el usuario por el email
      const user = await Usuario.findByEmail(email);
      // Validamos si el usuario esta registrado en la base de datos      
      if (!user)
        return {
          error: true,
          code: 401,
          message: "Este correo no ha sido registrado.",
          res
        };
      // Comparmamos la contraseña del usuarios registrado con la ingresada basado en la llave de encriptación
      const validPassword = await bcrypt.compare(password, user.password);
      // Validamos si la contraseña es la misma
      if (!validPassword)
        return {
          error: true,
          code: 401,
          message: "El correo o la contraseña proporcionados no son correctos.",
          res
        };

      const token = jwt.sign(
        {
          user_id: user.id,
          role_id: user.role_id
        },
        secretKey, 
        {
          expiresIn: tokenExpiration
        }
      );
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      })

      return { error: false, code: 200, message: "Login exitoso", 
        data: {
          user_id: user.id,
          role_id: user.role_id
        },
        res
       };
      
    } catch (error) {     
      console.log(error);
      
      return { error: true, code: 500, message: "Error al loguearse", res };
    }
  }


  static async logout(res) {
    try {
      
      res.clearCookie('token');

      return { error: false, code: 200, message: "Sesión cerrada con éxito", res };

    } catch (error) {
      return { error: true, code: 500, message: "Error al cerrar sesión", res };
    }
  }
}



export default AuthService;