const express = require('express')
const { dbConnection } = require('./database/config')
const cors = require('cors')
require('dotenv').config()

// Crear el servidor de express
const app = express()

// Base de datos
dbConnection()

// CORS (antes que las rutas)
app.use(cors())

// Directorio Público
app.use( express.static('public'))

// Lectura y parseo de JSON (body)
app.use(express.json())

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

// Escuchar peticiones
app.listen( process.env.PORT || 8081, () => {
    console.log(`Servidor corriendo en puerto ${8081}`);
})