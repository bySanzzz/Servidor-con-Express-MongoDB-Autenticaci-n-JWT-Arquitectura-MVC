import express from 'express'
import { connectDb } from './config/mongoDbConnection.js'
import { AlumnoRouter } from './routes/alumnoRouter.js'
import { AuthRouter } from './routes/authRouter.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import cors from "cors"
import { config } from 'dotenv'
config()
const entorno = "dev"
let PORT = 15000

if (entorno === "dev") {
  PORT = process.env.PORT
}

const server = express()

server.use(express.json())
server.use(cors())

server.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bienvenido al Administrador de estudiantes"
  })
})

server.use("/alumnos", authMiddleware, AlumnoRouter)
server.use("/auth", AuthRouter)

server.listen(PORT, () => {
  connectDb()
  console.log(`✅ Servidor en escucha por el puerto http://localhost:${PORT}`)
})

export { server }