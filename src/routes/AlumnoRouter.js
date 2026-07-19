import { Router } from "express"
import { requireRole } from "../middlewares/roleMiddleware.js"
import { validate } from "../middlewares/validateMiddleware.js" 
import { registerSchema, loginSchema,  } from "../schemas/tutorSchemas.js"
import { createAlumnoSchema, updateAlumnoSchema,queryParamsSchema } from "../schemas/alumnoSchemas.js"
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno,getAllAlumnos,deleteAnyAlumno} from "../controllers/alumnoControllers.js"


const AlumnoRouter = Router()

//Ruta de Administradores del sistema
AlumnoRouter.get("/all", requireRole("admin"), validate(queryParamsSchema, "query"), getAllAlumnos)
AlumnoRouter.delete("/all/:id", requireRole("admin"), deleteAnyAlumno)

//Ruta de Tutores legales
AlumnoRouter.get("/", validate(queryParamsSchema, "query"), getAlumnos)
AlumnoRouter.get("/:id", getAlumno)
AlumnoRouter.post("/", validate(createAlumnoSchema), createAlumno)
AlumnoRouter.patch("/:id", validate(updateAlumnoSchema), updateAlumno)
AlumnoRouter.delete("/:id", deleteAlumno)
export { AlumnoRouter }



