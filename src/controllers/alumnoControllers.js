import { Alumno } from "../models/AlumnoModel.js"

const getAlumnos = async (req, res) => {
  try {
    const userLogged = req.userLogged

    const filterAlumnos = await Alumno.find({ tutorId: userLogged.id }, { tutorId: 0 })

    if (filterAlumnos.length === 0) {
      return res.status(404).json({ success: false, error: "No hay Alumnos registrados relacionados a vos" })
    }

    res.json({
      success: true,
      data: filterAlumnos,
      message: "Alumnos encontrados"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error encontrando a alumnos" })
  }
}

const getAlumno = async (req, res) => {
  try {
    const id = req.params.id
    const userLogged = req.userLogged

    const foundAlumno = await Alumno.findById(id)

    if (!foundAlumno) {
      return res.status(404).json({ success: false, error: "No encontrado" })
    }

    if (foundAlumno.tutorId.toString() !== userLogged.id) {
      return res.status(403).json({
        success: false,
        error: "No eres el titular para poder verlo"
      })
    }

    const { tutorId, ...publicData } = foundAlumno.toObject()

    res.json({ success: true, data: publicData })
  } catch (error) {
    res.status(400).json({ success: false, error: "Formato de Id invalido" })
  }
}

const createAlumno = async (req, res) => {
  try {
    const body = req.body
    const userLogged = req.userLogged

    const alumnosData = Array.isArray(body) ? body : [body]

    const alumnosConTutor = alumnosData.map(alumno => ({
      dni: alumno.dni,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      edad: alumno.edad,
      curso: alumno.curso,
      tutorId: userLogged.id
    }))

    const nuevosAlumnos = await Alumno.insertMany(alumnosConTutor, { ordered: false })

    const publicData = nuevosAlumnos.map(({ tutorId, ...resto }) => resto)

    res.json({
      success: true,
      message: `${publicData.length} alumno(s) creado(s) exitosamente`
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Uno o más alumnos tienen un DNI que ya existe. Se guardaron los que no tenían conflicto."
      })
    }
    res.status(500).json({ success: false, error: "Fallo al crear al alumno" })
  }
}

const updateAlumno = async (req, res) => {
  try {
    const id = req.params.id
    const body = req.body
    const userLogged = req.userLogged

    const alumno = await Alumno.findById(id)

    if (!alumno) {
      return res.status(404).json({ success: false, error: "Alumno no encontrado" })
    }

    if (alumno.tutorId.toString() !== userLogged.id) {
      return res.status(403).json({
        success: false,
        error: "No eres el titular para poder modificarlo"
      })
    }

    const updatedAlumno = await Alumno.findByIdAndUpdate(
    id,
    { ...body },
    { returnDocument: "after", projection: { tutorId: 0 } }
  )

    res.json({
      success: true,
      data: updatedAlumno,
      message: "Alumno actualizado exitosamente"
    })
  } catch (error) {
    res.status(400).json({ success: false, error: "Id invalido" })
  }
}

const deleteAlumno = async (req, res) => {
  try {
    const { id } = req.params
    const userLogged = req.userLogged

    const alumno = await Alumno.findById(id)

    if (!alumno) {
      return res.status(404).json({ success: false, error: "Alumno no encontrado" })
    }

    if (alumno.tutorId.toString() !== userLogged.id) {
      return res.status(403).json({
        success: false,
        error: "No eres el titular para poder eliminarlo"
      })
    }

    const deletedAlumno = await Alumno.findByIdAndDelete(id)

    const deadAlumno = deletedAlumno.toObject()
    delete deadAlumno.tutorId

    res.json({ success: true, data: deadAlumno, message: "Alumno eliminado exitosamente" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Id invalido" })
  }
}
//ADMIN 


export { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno }