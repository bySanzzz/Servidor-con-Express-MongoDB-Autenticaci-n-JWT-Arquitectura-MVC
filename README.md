# 📚 API de Alumnos y Profesores (Node.js + Express + MongoDB)

## 📌 Descripción del proyecto

Este proyecto es una API REST desarrollada con **Node.js, Express y MongoDB**, que permite gestionar un sistema de **profesores y alumnos**.

Cada profesor puede:

- Registrarse e iniciar sesión (JWT)
- Crear alumnos
- Ver solo sus alumnos
- Modificar alumnos que le pertenecen
- Eliminar alumnos que le pertenecen

La API utiliza autenticación mediante **JSON Web Token (JWT)** para proteger las rutas y asegurar que cada profesor solo pueda acceder a sus propios recursos.

---

## ⚙️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors
  
## 🔐 Seguridad del sistema

Este proyecto implementa medidas de seguridad para proteger la información de los usuarios:

- 🔑 Las contraseñas de los profesores se almacenan utilizando **bcrypt (hashing)**, lo que significa que no se guardan en texto plano.
- 🔁 Cada contraseña se transforma en un hash antes de ser guardada en la base de datos.
- 🔓 Durante el login, se compara la contraseña ingresada con el hash almacenado usando bcrypt.
- 🎟️ Se utiliza **JWT (JSON Web Token)** para autenticar y proteger las rutas privadas.
---
Además, se aplican buenas prácticas de seguridad en el proyecto:

- 🚫 Se utiliza **.gitignore** para evitar subir archivos sensibles al repositorio, como `node_modules` o archivos de configuración.
- 🔐 Se usa el archivo **.env** para almacenar variables sensibles como claves secretas y conexión a la base de datos, evitando exponerlas en el código fuente.

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio
### 2. Ingresar al proyecto
### 3. Instalar dependencias
### 4. Configurar variables de entorno
- PORT=El que vos quieras (Max 60 mil)
- JWT_SECRET=tu_clave_secreta_segura
- MONGO_URL=tu_url_de_mongodb
### 5. Ejecutar proyecto

## 📡 Endpoints de la API

### 👨‍🏫 AUTH (Profesores)

- **POST /auth/register** → Registra un nuevo profesor en el sistema.
- **POST /auth/login** → Inicia sesión y devuelve un token JWT.

---

### 🎓 ALUMNOS (requiere token)

- **GET /alumnos** → Obtiene todos los alumnos del profesor logueado.
- **GET /alumnos/:id** → Obtiene un alumno específico por su ID.
- **POST /alumnos** → Crea un nuevo alumno asignado al profesor logueado.
- **PATCH /alumnos/:id** → Modifica los datos de un alumno (solo si es del profesor logueado).
- **DELETE /alumnos/:id** → Elimina un alumno (solo si pertenece al profesor logueado).

---

## 📡 Ejemplos de endpoints

### 👨‍🏫 AUTH
- POST http://localhost:****/auth/register  
- POST http://localhost:****/auth/login  

### 🎓 ALUMNOS
- GET http://localhost:****/alumnos  
- GET http://localhost:****/alumnos/:id (Especifico)
- POST http://localhost:****/alumnos  
- PATCH http://localhost:****/alumnos/:id  
- DELETE http://localhost:****/alumnos/:id  
