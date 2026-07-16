import { Schema, model } from "mongoose"
import { z } from "zod"


const alumnoSchema = new Schema({
  dni: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  curso: { type: Number, required: true },
  tutorId: { type: Schema.Types.ObjectId, ref: "Tutor", required: true }
}, {
  versionKey: false,
  timestamps: true
})

const Alumno = model("Alumno", alumnoSchema)

export { Alumno }