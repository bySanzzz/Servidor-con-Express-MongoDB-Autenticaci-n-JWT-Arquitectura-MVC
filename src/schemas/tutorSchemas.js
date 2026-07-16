import { z } from "zod"
//Formato que debe tener nuestro 
const registerSchema = z.object({
  nombre: z.string().min(3, "Campo incompleto"),
  email: z.string().email("Formato de Email inválido"),
  telefono: z.number("El teléfono debe ser un número" ),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/\d/, "Debe contener al menos un número")
    .regex(/[@$!%*?&.#_-]/, "Debe contener al menos un carácter especial"),
  role: z.enum(["user", "admin"]).optional()
})

const loginSchema = z.object({
  email: z.string().email("Formato de Email inválido"),
  password: z.string().min(1, "Campo incompleto")
})

export { registerSchema, loginSchema }