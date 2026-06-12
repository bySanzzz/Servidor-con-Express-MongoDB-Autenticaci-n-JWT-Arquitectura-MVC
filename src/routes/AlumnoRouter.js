import { Router } from "express"
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno} from "../controllers/alumnoControllers.js"

const AlumnoRouter = Router()

AlumnoRouter.get("/", getAlumnos)
AlumnoRouter.get("/:id", getAlumno)
AlumnoRouter.post("/", createAlumno)
AlumnoRouter.patch("/:id", updateAlumno)
AlumnoRouter.delete("/:id", deleteAlumno)

export { AlumnoRouter }




