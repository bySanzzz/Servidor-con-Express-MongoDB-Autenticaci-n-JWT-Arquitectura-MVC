# 📚 API de Alumnos y Tutores (Node.js + Express + MongoDB)

## 📌 Descripción del proyecto

Este proyecto es una API REST desarrollada con **Node.js, Express y MongoDB**, que permite gestionar un sistema de **tutores y alumnos**, con control de acceso basado en **roles** (`user` / `admin`).

Cada **Tutor** (padre/madre a cargo) puede:
- Registrarse e iniciar sesión (JWT)
- Elegir su rol al registrarse: `user` (tutor normal) o `admin`
- Crear alumnos (uno o varios a la vez)
- Ver, modificar y eliminar únicamente los alumnos que le pertenecen
- Filtrar, ordenar y paginar sus resultados mediante query params

Un **Tutor con rol `admin`** además puede:
- Ver **todos** los alumnos del sistema, sin importar de qué tutor sean
- Eliminar **cualquier** alumno, sin importar de qué tutor sea

La API utiliza autenticación mediante **JSON Web Token (JWT)**, validación de datos con **Zod**, logging de requests con **Morgan**, manejo centralizado de errores, y sigue una arquitectura **MVC modular**.

---

## ⚙️ Tecnologías utilizadas

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Zod (validación de datos)
- Morgan (logger de requests)
- express-rate-limit (limitador de intentos de login)
- dotenv
- cors

---

## 🔐 Seguridad del sistema

- 🔑 Las contraseñas de los tutores se almacenan utilizando **bcrypt (hashing)** — nunca se guardan en texto plano.
- 🔁 Cada contraseña se transforma en un hash antes de ser guardada en la base de datos.
- 🔓 Durante el login, se compara la contraseña ingresada con el hash almacenado usando bcrypt.
- 🎟️ Se utiliza **JWT** para autenticar y proteger las rutas privadas. El token incluye el `role` del tutor, lo que permite controlar permisos sin volver a consultar la base de datos en cada request.
- 👮 Un middleware de **roles** (`requireRole`) restringe el acceso a rutas exclusivas de `admin`.
- 🚦 Un **rate limiter** limita los intentos de login (5 intentos cada 15 minutos) para mitigar ataques de fuerza bruta.
- ✅ Todos los endpoints que reciben datos del cliente (`body` o `query`) están validados con **Zod** antes de llegar a la lógica de negocio.
- 🧯 Un manejo centralizado de errores garantiza respuestas consistentes en formato JSON, tanto para rutas inexistentes (`404`) como para errores no controlados (`500`).
- 🚫 Se utiliza **.gitignore** para evitar subir archivos sensibles al repositorio, como `node_modules` o `.env`.
- 🔐 Se usa el archivo **.env** para almacenar variables sensibles (clave JWT, conexión a la base de datos), evitando exponerlas en el código fuente.

---

## 🏗️ Arquitectura del proyecto

```
src/
├── app.js                        # Entry point del servidor
├── config/
│   └── mongoDbConnection.js      # Conexión a MongoDB Atlas
├── controllers/
│   ├── tutorControllers.js       # Lógica de register/login
│   └── alumnoControllers.js      # Lógica CRUD de alumnos (user + admin)
├── middlewares/
│   ├── authMiddleware.js         # Verifica y decodifica el JWT
│   ├── roleMiddleware.js         # Restringe rutas según el rol (admin/user)
│   ├── validateMiddleware.js     # Valida body/query contra un schema de Zod
│   ├── limiterMiddleware.js      # Rate limiter para login
│   └── errorMiddleware.js        # Manejo centralizado de errores y 404
├── models/
│   ├── TutorModel.js             # Schema de Mongoose: Tutor
│   └── AlumnoModel.js            # Schema de Mongoose: Alumno
├── routes/
│   ├── authRouter.js             # Rutas públicas de autenticación
│   └── alumnoRouter.js           # Rutas privadas de alumnos (user/admin)
└── schemas/
    ├── tutorSchemas.js           # Schemas de Zod: register, login
    └── alumnoSchemas.js          # Schemas de Zod: create, update, query params
```

---

## 👥 Roles del sistema

| Rol | Cómo se obtiene | Permisos |
|---|---|---|
| `user` | Default al registrarse (o no enviando `role`) | CRUD de sus **propios** alumnos |
| `admin` | Enviando `"role": "admin"` al registrarse | Todo lo del `user`, más ver y eliminar **cualquier** alumno del sistema |

El rol viaja codificado y firmado dentro del JWT. El middleware `requireRole("admin")` lee `req.userLogged.role` (colocado ahí por `authMiddleware` al decodificar el token) y bloquea el acceso con `403` si el rol no coincide.

---

## ✅ Validación con Zod

Todos los endpoints que reciben datos validan su `body` o `query` contra un schema de Zod **antes** de ejecutar cualquier lógica de negocio, mediante el middleware `validate(schema, source)`:

```javascript
AuthRouter.post("/register", validate(registerSchema), register)
AlumnoRouter.post("/", validate(createAlumnoSchema), createAlumno)
AlumnoRouter.get("/", validate(queryParamsSchema, "query"), getAlumnos)
```

Si la validación falla, la API responde `400` con el detalle de cada campo inválido:

```json
{
  "success": false,
  "error": [
    { "campo": "dni", "mensaje": "El DNI debe ser un número" },
    { "campo": "edad", "mensaje": "Number must be greater than 0" }
  ]
}
```

Reglas destacadas:
- `password`: mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial.
- `email`: formato de email válido.
- `dni`: número entero de 7 u 8 dígitos.
- `curso`: número entero entre 1 y 6.
- `createAlumnoSchema` acepta **un objeto o un array de objetos**, para permitir carga masiva de alumnos en un solo `POST`.
- `updateAlumnoSchema`: mismos campos que crear, pero todos opcionales (para `PATCH` parcial).
- `queryParamsSchema`: convierte automáticamente `page`/`limit` de string a número (`z.coerce.number()`), y aplica valores por defecto si no se envían.

---

## 📝 Logger

Se utiliza **Morgan** en modo `"dev"` para registrar en consola cada request recibida (método, ruta, status code y tiempo de respuesta), útil para debugging durante el desarrollo:

```
GET /alumnos 200 15.234 ms - 342
POST /auth/register 409 4.812 ms - 78
```

---

## 🧯 Manejo centralizado de errores

- Cualquier ruta no definida (por ejemplo, un typo en la URL) devuelve un `404` consistente en formato JSON:
```json
{ "success": false, "error": "Ruta no encontrada: GET /alumnoss" }
```
- Cualquier error no controlado que llegue a `next(error)` es capturado por un middleware de error final, que responde siempre con el mismo formato:
```json
{ "success": false, "error": "Descripción del error" }
```

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
```

### 2. Ingresar al proyecto
```bash
cd servidor-http
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz, basado en `.env.example`:

```
PORT=15000
JWT_SECRET=tu_clave_secreta_segura
MONGO_URI=tu_url_de_mongodb
```

### 5. Ejecutar el proyecto
```bash
npm run dev
```

---

## 📡 Endpoints de la API

### 🔑 AUTH (públicos)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registra un nuevo tutor. Rol opcional (`user` por default, o `admin`). |
| `POST` | `/auth/login` | Inicia sesión y devuelve un token JWT (con el `role` incluido). |

### 🎓 ALUMNOS — rol `user` (requiere token)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/alumnos` | Lista los alumnos del tutor logueado. Soporta query params. |
| `GET` | `/alumnos/:id` | Obtiene un alumno específico (solo si es del tutor logueado). |
| `POST` | `/alumnos` | Crea uno o varios alumnos, asignados al tutor logueado. |
| `PATCH` | `/alumnos/:id` | Modifica un alumno (solo si pertenece al tutor logueado). |
| `DELETE` | `/alumnos/:id` | Elimina un alumno (solo si pertenece al tutor logueado). |

### 👑 ALUMNOS — rol `admin` (requiere token + rol admin)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/alumnos/all` | Lista **todos** los alumnos del sistema, de cualquier tutor. Soporta query params. |
| `DELETE` | `/alumnos/all/:id` | Elimina **cualquier** alumno, sin importar el tutor dueño. |

---

## 🔎 Query params (paginación, orden y filtro)

Disponibles en `GET /alumnos` y `GET /alumnos/all`.

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | número | `1` | Página de resultados |
| `limit` | número | `10` | Cantidad de resultados por página |
| `sort` | `asc` \| `desc` | `asc` | Orden según fecha de creación |
| `filter` | string (`campo:valor`) | — | Filtra por un campo específico, ej: `curso:5` |

Ejemplos:
```
GET http://localhost:15000/alumnos?page=1&limit=5
GET http://localhost:15000/alumnos?sort=desc
GET http://localhost:15000/alumnos?filter=curso:5
GET http://localhost:15000/alumnos?page=2&limit=5&sort=asc&filter=curso:4
GET http://localhost:15000/alumnos/all?page=1&limit=20
```

---

## 📡 Ejemplos de requests

### Registrar un tutor (rol `user` por default)
```
POST http://localhost:15000/auth/register
Content-Type: application/json

{
  "nombre": "Martín Fernández",
  "email": "martin.fernandez@gmail.com",
  "telefono": 1123456789,
  "password": "Padre2026#"
}
```

### Registrar un tutor con rol `admin`
```
POST http://localhost:15000/auth/register
Content-Type: application/json

{
  "nombre": "Laura Sánchez",
  "email": "laura.admin@gmail.com",
  "telefono": 1198765432,
  "password": "Directora2026#",
  "role": "admin"
}
```

### Login
```
POST http://localhost:15000/auth/login
Content-Type: application/json

{
  "email": "martin.fernandez@gmail.com",
  "password": "Padre2026#"
}
```

Respuesta:
```json
{
  "success": true,
  "data": { "token": "eyJhbGciOiJIUzI1NiIs..." },
  "message": "Login Exitoso"
}
```

### Crear un alumno
```
POST http://localhost:15000/alumnos
Authorization: Bearer <token>
Content-Type: application/json

{ "dni": 32111222, "nombre": "Rocío", "apellido": "Benítez", "edad": 15, "curso": 4 }
```

### Crear varios alumnos a la vez
```
POST http://localhost:15000/alumnos
Authorization: Bearer <token>
Content-Type: application/json

[
  { "dni": 32222333, "nombre": "Tomás", "apellido": "Villalba", "edad": 16, "curso": 5 },
  { "dni": 32333444, "nombre": "Nadia", "apellido": "Correa", "edad": 14, "curso": 3 }
]
```

### Listar mis alumnos, paginado y ordenado
```
GET http://localhost:15000/alumnos?page=1&limit=5&sort=desc
Authorization: Bearer <token>
```

### Actualizar un alumno
```
PATCH http://localhost:15000/alumnos/<id>
Authorization: Bearer <token>
Content-Type: application/json

{ "curso": 5 }
```

### Eliminar un alumno propio
```
DELETE http://localhost:15000/alumnos/<id>
Authorization: Bearer <token>
```

### (Admin) Ver todos los alumnos del sistema
```
GET http://localhost:15000/alumnos/all?page=1&limit=10
Authorization: Bearer <token_de_admin>
```

### (Admin) Eliminar cualquier alumno
```
DELETE http://localhost:15000/alumnos/all/<id>
Authorization: Bearer <token_de_admin>
```

---

## 🧪 Colección de pruebas

En la raíz del repositorio se incluye la carpeta **`Sample API Collection/`**, exportada desde **Bruno** (alternativa open source a Postman/Thunder Client), con todas las requests documentadas en este README ya armadas: registro de tutor/admin, login, CRUD de alumnos, endpoints de admin, y variables de entorno.

Para usarla:
1. Abrir **Bruno**.
2. **Open Collection** → seleccionar la carpeta `Sample API Collection/`.
3. Ejecutar `POST Login` (o `Register` primero si no hay usuarios cargados) para obtener un token.
4. Configurar el token obtenido en la variable de entorno de la colección para que se use automáticamente en las requests protegidas.

---

## 📄 Licencia

ISC
