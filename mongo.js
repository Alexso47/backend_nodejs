const mongoose = require('mongoose')
const config = require('./utils/config')

const connectionString = config.MONGO_DB_URI

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

