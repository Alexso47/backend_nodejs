const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')
const mongoose = require('mongoose')

const api = supertest(app)

const userId = mongoose.Types.ObjectId()

// asegurarse que la base de datos funcione
const initialNotes = [
    {
        _id: mongoose.Types.ObjectId(),
        content: 'Hola que tal',
        important: true,
        date: new Date(),
        user: userId
    },
    {
        _id: mongoose.Types.ObjectId(),
        content: 'Pos arreglao',
        important: false,
        date: new Date(),
        user: userId
    }
]

const getAllContentFromNotes = async () => {
    const response = await api.get('/api/notes/')
    return {
        contents: response.body.map(note => note.content),
        response: response
    }
}

const getUsers = async () => {
    const usersDB = await User.find({})
    return usersDB.map(user => user.toJSON())
}

module.exports = {
    initialNotes,
    api,
    getAllContentFromNotes,
    getUsers,
    userId
}