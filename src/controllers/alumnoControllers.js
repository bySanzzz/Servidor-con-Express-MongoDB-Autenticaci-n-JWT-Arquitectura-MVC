import { Alumno } from "../models/AlumnoModel.js"

const getAlumnos = async (req, res) => {
  try {
    const userLogged = req.userLogged
    const { page, limit, sort, filter } = req.query

    const query = { tutorId: userLogged.id }

    if (filter) {
      const [campo, valor] = filter.split(":")
      query[campo] = valor
    }

    const sortOption = sort === "desc" ? { createdAt: -1 } : { createdAt: 1 }

    const filterAlumnos = await Alumno.find(query, { tutorId: 0 })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)

    if (filterAlumnos.length === 0) {
      return res.status(404).json({ success: false, error: "No hay Alumnos registrados" })
    }

    res.json({ success: true, data: filterAlumnos, message: "Alumnos encontrados", meta: { page, limit }})
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

    const alumnosData = Array.isArray(body) ? body : [body] // Se verifica si es un array de varios alumnos o de uno solo

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

    res.json({ success: true, message: "Alumno eliminado exitosamente" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Id invalido" })
  }
}


// PERMISOS DE ADMIN 

const getAllAlumnos = async (req, res) => {
  try {
    const { page, limit, sort, filter } = req.query

    const query = {}

    if (filter) {
      const [campo, valor] = filter.split(":")
      query[campo] = valor
    }

    const sortOption = sort === "desc" ? { createdAt: -1 } : { createdAt: 1 }

    const allAlumnos = await Alumno.find(query, { tutorId: 0 })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
    if (allAlumnos.length === 0) {
      return res.status(404).json({ success: false, error: "No hay Alumnos registrados" })
    }

    res.json({success: true,data: allAlumnos,message: "Alumnos encontrados",meta: { page, limit }})
  } catch (error) {
    res.status(500).json({ success: false, error: "Error encontrando a alumnos" })
  }
}

const deleteAnyAlumno = async (req, res) => {
  try {
    const { id } = req.params
    const alumno = await Alumno.findById(id)

    if (!alumno) {
      return res.status(404).json({ success: false, error: "Alumno no encontrado" })
    }

    const deletedAlumno = await Alumno.findByIdAndDelete(id)

    const deadAlumno = deletedAlumno.toObject()
    delete deadAlumno.tutorId

    res.json({ success: true, message: "Alumno eliminado exitosamente" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Id invalido" })
  }
}


export { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno, deleteAnyAlumno,getAllAlumnos }