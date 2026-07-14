import { Schema, model } from "mongoose"

const tutorSchema = new Schema({
  nombre: { type: String, required: true },
  telefono: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user"} // Damos como rol user o admin, si el usuario no especifica cual es por default queda user
}, {
  versionKey: false,
  timestamps: true
  
})

const Tutor = model("Tutor", tutorSchema)

export { Tutor }