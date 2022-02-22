//leer varaibles de entorno
require('dotenv').config()

const path = require("path")

//swagger
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = {
  definition:{
    openapi: "3.0.0",
    info:{
      title: "Node MongoDB API",
      version: "1.0.0"
    },
    servers:[
      {
        url: "http://localhost:3001"
      }
    ]
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`]
}

//llamar a las rutas
const userRoute = require("./routes/note");
const express = require('express')


const app = express()
const cors = require('cors')

//midelwares
app.use(cors())
app.use(express.json())
app.use("/note", userRoute)
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//lanzar en el puerto 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
