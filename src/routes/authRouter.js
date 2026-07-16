import { Router } from "express"
import { limiter } from "../middlewares/limiterMiddleware.js"
import { register, login } from "../controllers/TutorControllers.js"
import { validate } from "../middlewares/validateMiddleware.js"           
import { registerSchema, loginSchema } from "../schemas/tutorSchemas.js"

const AuthRouter = Router()

AuthRouter.post("/register", validate(registerSchema), register)         
AuthRouter.post("/login", limiter, validate(loginSchema), login)  

export { AuthRouter }