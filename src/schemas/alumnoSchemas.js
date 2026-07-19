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

const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sort: z.enum(["asc", "desc"]).optional(),
  filter: z.string().optional()
})


const updateAlumnoSchema = alumnoBaseSchema.partial()


export {createAlumnoSchema, updateAlumnoSchema, queryParamsSchema }