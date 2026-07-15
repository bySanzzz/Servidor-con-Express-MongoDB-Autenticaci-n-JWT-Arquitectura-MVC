import { Router } from "express"
import { requireRole } from "../middlewares/roleMiddleware.js"
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno,getAllAlumnos,deleteAnyAlumno} from "../controllers/alumnoControllers.js"

const AlumnoRouter = Router()


AlumnoRouter.get("/all", requireRole("admin"), getAllAlumnos)
AlumnoRouter.delete("/all/:id", requireRole("admin"), deleteAnyAlumno)

// Rutas normales (dueño del recurso)
AlumnoRouter.get("/", getAlumnos)
AlumnoRouter.get("/:id", getAlumno)
AlumnoRouter.post("/", createAlumno)
AlumnoRouter.patch("/:id", updateAlumno)
AlumnoRouter.delete("/:id", deleteAlumno)

export { AlumnoRouter }



