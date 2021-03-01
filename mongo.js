const mongoose = require('mongoose')
require('dotenv').config()

const connectionString = process.env.MONGO_DB_URI

// conexión a mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })

process.on('uncaughtException', () => {
    mongoose.connection.diconnect()
})

