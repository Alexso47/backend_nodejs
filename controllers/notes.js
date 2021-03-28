const notesRouter = require('express').Router()

// Models
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    return response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        return note
            ? response.json(note)
            : response.status(404).end()
    }).catch(next)
})

notesRouter.delete('/:id', async (request, response, next) => {
    try {
        const id = request.params.id
        await Note.findByIdAndRemove(id)
        response.status(204).end()
    }
    catch (error) {
        next(error)
    }
})

notesRouter.post('/', async (request, response, next) => {
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

    // newNote.save().then(savedNote => response.status(201).json(savedNote))
    try {
        const savedNote = await newNote.save()
        response.status(201).json(savedNote)
    }
    catch (error) {
        next(error)
    }
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