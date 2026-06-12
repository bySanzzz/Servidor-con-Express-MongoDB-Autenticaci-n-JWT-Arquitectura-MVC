import { Schema, model } from "mongoose"

const alumnoSchema = new Schema({
  nombre: { type: String,required: true },
  apellido: { type: String,required: true },
  edad: { type: Number,required: true },
  curso: { type: String, required: true },
  profesorId: { type: Schema.Types.ObjectId,ref: "Profesor",required: true }
}, {
  versionKey: false,
  timestamps: true
})

const Alumno = model("Alumno", alumnoSchema)

export { Alumno }