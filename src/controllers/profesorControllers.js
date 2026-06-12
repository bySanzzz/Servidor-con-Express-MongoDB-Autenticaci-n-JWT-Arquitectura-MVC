import { Profesor } from "../models/ProfesorModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const register = async (req, res) => {
  try {
    const { body } = req
    const { password, nombre, email, especialidad } = body

    const foundProfesor = await Profesor.findOne({ email })

    if (foundProfesor) {
      return res.status(409).json({ success: false, error: "Ya existe cuenta del profesor que quieres ingresar, intenta loguearte" })
    }

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/
    if (!regex.test(password)) {
      return res.status(400).json({ success: false, error: "Contraseña no válida. Debe contener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial." })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newProfesor = await Profesor.create({
      nombre,
      email,
      especialidad,
      password: hashPassword,
    })

    newProfesor.save()

    const publicDataProfesor = {
      id: newProfesor._id,
      nombre: newProfesor.nombre,
      email: newProfesor.email,
      especialidad: newProfesor.especialidad,
      createdAt: newProfesor.createdAt,
      updatedAt: newProfesor.updatedAt
    }

    res.json({
      success: true,
      data: publicDataProfesor,
      message: "Usuario registrado exitosamente"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error registrando usuario"
    })
  }
}

const login = async (req, res) => {
  try {
    const { body } = req
    const { email, password } = body

    if (!email || !password) {
      return res.status(401).json({ success: false, error: "Desautorizado" })
    }

    const foundProfesor = await Profesor.findOne({ email })

    if (!foundProfesor) {
      return res.status(403).json({ success: false, error: "Desautorizado" })
    }

    const isValid = await bcrypt.compare(password, foundProfesor.password)

    if (!isValid) {
      return res.status(403).json({ success: false, error: "Desautorizado" })
    }

    const payload = {
      id: foundProfesor._id,
      nombre: foundProfesor.nombre,
      email: foundProfesor.email,
      especialidad: foundProfesor.especialidad
    }

    const secretKey = process.env.JWT_SECRET

    const token = jwt.sign(payload, secretKey, { expiresIn: "2h" })

    res.json({ success: true, data: { token }, message: "Login Exitoso" })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error logging" })
  }
}

export { register, login }