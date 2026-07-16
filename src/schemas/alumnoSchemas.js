import { z } from "zod"

const alumnoBaseSchema = z.object({
  dni: z.number().min(1000000, "El DNI debe ser un número" ).positive(), //Pensando en que los DNI hoy en dia arrancan desde el millon
  nombre: z.string().min(3),
  apellido: z.string().min(3),
  edad: z.number().int().positive(),
  curso: z.number().int().min(1).max(7, "El curso debe ser entre 1 y 7")
})

const createAlumnoSchema = z.union([
  alumnoBaseSchema,
  z.array(alumnoBaseSchema).min(1, "El array no puede estar vacío")
])


const updateAlumnoSchema = alumnoBaseSchema.partial()


export {createAlumnoSchema, updateAlumnoSchema }