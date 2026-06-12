import { Schema, model } from "mongoose"

const profesorSchema = new Schema({
  nombre: {type: String,required: true},
  especialidad: {type: String,required: true},
  email: {type: String,required: true,unique: true},
  password: {type: String,required: true}
}, {
  versionKey: false,
  timestamps: true
})

const Profesor = model("Profesor", profesorSchema)

export { Profesor }