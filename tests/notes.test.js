const mongoose = require('mongoose')
const Note = require('../models/Note')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const {
    userId,
    initialNotes,
    api,
    getAllContentFromNotes
} = require('./helpers')

describe('testing notes', () => {
    beforeEach(async () => {
        await Note.deleteMany({})
        await User.deleteMany({})

        let notesId = initialNotes.map(note => note._id)
        const newUser = new User({ _id: userId, username: 'AlexsoTesteandoNotes', name: 'AlexTestNotes', passwordHash: 'pswd', notes: notesId })
        await newUser.save()

        for (let note of initialNotes) {
            const newNote = new Note(note)
            await newNote.save()
        }
    })

    // se necesita el async y await pq acceder a la base de datos es un metodo asincrono, 
    // de otro modo omitiría este test.
    // el content type se pasa con regex pq no sabe si va a llegarle algo
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })

    // | npm run test -- -t "there are notes" | --> ejecuta solamente este test
    test('there are notes', async () => {
        const response = await api.get('/api/notes')

        expect(response.body).toHaveLength(initialNotes.length)
    })

    test('the content in the first note', async () => {
        const response = await api.get('/api/notes/')

        expect(response.body[0].content).toBe(initialNotes[0].content)
    })

    test('there is a note that contains Pos arreglao ', async () => {
        const { contents } = await getAllContentFromNotes()

        expect(contents).toContain('Pos arreglao')
    })

    test('a valid note can be added', async () => {
        let newNote = {
            content: 'Uea que pasa acabo de llegar',
            userId: userId
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const { contents, response } = await getAllContentFromNotes();
        expect(response.body).toHaveLength(initialNotes.length + 1)
        expect(contents).toContain(newNote.content)
    })

    test('a invalid note can\'t be added', async () => {
        let newNote = {
            important: false,
            userId: userId
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const { response } = await getAllContentFromNotes()
        expect(response.body).toHaveLength(initialNotes.length)
    })

    test('deleting a note created', async () => {
        const firstResponse = await getAllContentFromNotes()
        const noteToDelete = firstResponse.response.body[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        const { contents, response: secondResponse } = await getAllContentFromNotes()
        expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
        expect(contents).not.toContain(noteToDelete.content)
    })

    test('deleting a note that don\'t exist', async () => {
        await api
            .delete(`/api/notes/1234`)
            .expect(400)

        const { response } = await getAllContentFromNotes()
        expect(response.body).toHaveLength(initialNotes.length)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})