const mongoose = require('mongoose')
//const password = require('./password.js')
const connectionString = process.env.MONGO_DB_URI

//Conexion MongoDB
mongoose.connect(connectionString)
.then(() => {
    console.log('DataBase Connected')
}).catch(err =>{
    console.error(err)
})

/*Listar datos
Note.find({}).then(result =>{
    console.log(result)
    mongoose.connection.close()
})*/

/*Crear datos
const note = new Note({
    content: 'Node es muy importante',
    date: new Date(),
    important: true
})

note.save()
.then(result => {
    console.log(result)
    mongoose.connection.close()
}).catch(err => {
    console.error(err)
})*/