const notesRouter = require('express').Router()

// Models
const Note = require('../models/Note')

notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => response.json(notes))
})

notesRouter.get('/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        return note
            ? response.json(note)
            : response.status(404).end()
    }).catch(next)
})

notesRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndRemove(id).then(() => response.status(204)).catch(next)
})

notesRouter.post('/', (request, response) => {
    const note = request.body
    if (!note || !note.content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false
    })

    newNote.save().then(savedNote => response.json(savedNote))

    response.status(201).json(newNote)
})

notesRouter.put('/:id', (request, response, next) => {
    const id = request.params.id
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    // El objeto nuevo se devuelve cuando especificas el tercer argumento, 
    // de normal te devuelve el objeto que se actualiza
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => response.json(result))
        .catch(next)
})

module.exports = notesRouter