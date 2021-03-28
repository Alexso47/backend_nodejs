const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

// asegurarse que la base de datos funcione
const initialNotes = [
    {
        content: 'Hola que tal',
        important: true,
        date: new Date(),
    },
    {
        content: 'Pos arreglao',
        important: false,
        date: new Date(),
    }
]

const getAllContentFromNotes = async () => {
    const response = await api.get('/api/notes/')
    return {
        contents: response.body.map(note => note.content),
        response: response
    }
}

module.exports = {
    initialNotes,
    api,
    getAllContentFromNotes
}