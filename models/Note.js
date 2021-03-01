const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

// formatea la info necesario de los campos del modelo
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'Browser can execute only JavaScript',
//     date: new Date(),
//     important: true
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

// Note.find().then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

module.exports = Note