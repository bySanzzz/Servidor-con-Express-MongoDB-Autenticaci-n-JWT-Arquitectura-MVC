import { Tutor } from "../models/TutorModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import { z } from "zod"
config()

const register = async (req, res) => {
  try {
    const { body } = req
    const { password, nombre, email, telefono, role } = body

    const foundTutor = await Tutor.findOne({ email })

    if (foundTutor) {
      return res.status(409).json({ success: false, error: "Ya existe cuenta del tutor que quieres ingresar, intenta loguearte" })
    }
    const hashPassword = await bcrypt.hash(password, 10)

    const newTutor = await Tutor.create({
      nombre,
      email,
      telefono,
      password: hashPassword,
      role
    })

    newTutor.save()

    const publicDataTutor = {
      id: newTutor._id,
      nombre: newTutor.nombre,
      email: newTutor.email,
      telefono: newTutor.telefono,
      role: newTutor.role,
      createdAt: newTutor.createdAt,
      updatedAt: newTutor.updatedAt
    }

    res.json({
      success: true,
      data: publicDataTutor,
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

    const foundTutor = await Tutor.findOne({ email })

    if (!foundTutor) {
      return res.status(403).json({ success: false, error: "Desautorizado" })
    }

    const isValid = await bcrypt.compare(password, foundTutor.password)

    if (!isValid) {
      return res.status(403).json({ success: false, error: "Desautorizado" })
    }

    const payload = {
      id: foundTutor._id,
      nombre: foundTutor.nombre,
      email: foundTutor.email,
      telefono: foundTutor.telefono,
      role: foundTutor.role
    }

    const secretKey = process.env.JWT_SECRET

    const token = jwt.sign(payload, secretKey, { expiresIn: "2h" })

    res.json({ success: true, data: { token }, message: "Login Exitoso" })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error logging" })
  }
}

export { register, login }