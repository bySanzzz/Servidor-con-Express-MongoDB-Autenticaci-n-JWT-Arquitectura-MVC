import { Alumno } from "../models/AlumnoModel.js"

const getAlumnos = async (req, res) => {
  try {
    const userLogged = req.userLogged
    
    const filterAlumnos = await Alumno.find({ profesorId: userLogged.id },{ profesorId: 0 }) //Filtramos todos los alumnos que son pertenecientes a su profesor

    if (filterAlumnos.length === 0) {
      res.status(404).json({ success: false, error: "No hay Alumnos registrados" })
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

const getAlumno = async (req, res) => { //Filtramos ese unico alumno en especifico
  try {
    const id = req.params.id
    const foundAlumno = await Alumno.findById(id, { profesorId: 0 })
    if (alumno.profesorId.toString() !== userLogged.id) {
      return res.status(403).json({
        success: false,
        error: "No eres el titular para poder modificarlo"
      })
    }

    if (!foundAlumno) res.status(404).json({ error: "No encontrado" })

    res.json(foundAlumno)
  } catch (error) {
    res.status(400).json({ error: "Formato de Id invalido" })
  }
}

const createAlumno = async (req, res) => {//Crear alumno
  try {
    const body = req.body
    const userLogged = req.userLogged

    const newAlumno = await Alumno.create({
      nombre: body.nombre,
      apellido: body.apellido,
      edad: body.edad,
      curso: body.curso,
      profesorId: userLogged.id // Asignarle el propio profesor asignado
    })

    newAlumno.save()

    const { profesorId, ...publicDataAlumno } = newAlumno.toObject()

    res.json({
      success: true,
      data: publicDataAlumno,
      message: "Alumno creado exitosamente"
    })
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        error: "Alumno no encontrado"
      })
    }

    if (alumno.profesorId.toString() !== userLogged.id) { //Solo los profesores con el id implementado con el alumno pueden modificarlo
      return res.status(403).json({
        success: false,
        error: "No eres el titular para poder modificarlo"
      })
    }

    const updatedAlumno = await Alumno.findByIdAndUpdate(id,{ ...body },{ new: true, projection: { profesorId: 0 } })

    if (!updatedAlumno) {
      return res.status(404).json({ success: false, error: "Alumno no encontrado" })
    }

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
      return res.status(404).json({
        success: false,
        error: "Alumno no encontrado"
      })
    }

    if (alumno.profesorId.toString() !== userLogged.id) { //Solo los profesores con el id implementado con el alumno pueden eliminar
      return res.status(403).json({
        success: false,
        error: "No eres el titular para poder eliminarlo"
      })
    }

    const deletedAlumno = await Alumno.findByIdAndDelete(id)

    const deadAlumno = deletedAlumno.toObject()
    delete deadAlumno.profesorId

    res.json({success: true,data: alumno,message: "Alumno eliminado exitosamente"})
  } catch (error) {
    res.status(400).json({ success: false, error: "Id invalido" })
  }
}

export { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno}