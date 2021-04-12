const notesRouter = require('express').Router()

// Models
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    return response.status(200).json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    try {
        const id = request.params.id
        const note = await Note.findById(id).populate('user', { username: 1, name: 1 })
        return response.status(200).json(note)
    }
    catch (error) {
        next(error)
    }
})

notesRouter.delete('/:id', async (request, response, next) => {
    try {
        const { userId } = request
        const id = request.params.id

        const user = await User.findById(userId)
        const noteToDelete = await Note.findById(id)

        const userNotes = user.notes.filter(note => {
            note !== noteToDelete._id
        })
        user.notes = userNotes

        await user.save()
        await Note.findByIdAndRemove(id)
        response.status(204).end()
    }
    catch (error) {
        next(error)
    }
})

notesRouter.post('/', async (request, response, next) => {
    try {
        const { userId } = request
        const user = await User.findById(userId)

        const note = request.body
        if (!note || !note.content) {
            return response.status(400).json({
                error: 'note.content is missing'
            })
        }

        const newNote = new Note({
            content: note.content,
            date: new Date(),
            important: note.important || false,
            user: user._id
        })

        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        savedNote.user = user
        response.status(201).json(savedNote)
    }
    catch (error) {
        next(error)
    }
})

notesRouter.put('/:id', async (request, response, next) => {
    const id = request.params.id
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    try {
        // El objeto nuevo se devuelve cuando especificas el tercer argumento, 
        // de normal te devuelve el objeto que se actualiza
        let noteUpdated = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).populate('user', { username: 1, name: 1 })
        response.status(200).json(noteUpdated)
    }
    catch (error) {
        next(error)
    }
})

module.exports = notesRouter