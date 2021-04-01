const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// formatea la info necesario de los campos del modelo
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = model('Note', noteSchema)

module.exports = Note


// const Note = mongoose.model('Note', noteSchema)

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