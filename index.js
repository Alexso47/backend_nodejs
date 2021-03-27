require('./mongo')

// Por defecto configura que cualquier origen puede acceder a la api
const express = require('express')
const app = express()
const cors = require('cors')
const { response } = require('express')

// Utilizando Env https://humanwhocodes.com/blog/2021/02/introducing-env-javascript-environment-variables/#fn:1
const { Env } = require("@humanwhocodes/env");
const env = new Env()

// Utilizando dotenv
require('dotenv').config()
// Ejecuta el archivo env y lo asigna a la variable process.env

// Middlewares
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

// Models
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())
// Se incluye el front como static
app.use(express.static('build'))
app.use(express.static('images'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => response.json(notes))
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        return note
            ? response.json(note)
            : response.status(404).end()
    }).catch(next)
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndRemove(id).then(() => response.status(204)).catch(next)
})

app.post('/api/notes', (request, response) => {
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

app.put('/api/notes/:id', (request, response, next) => {
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

app.use(notFound)

app.use(handleErrors)
// Cuando se usa un next() sin parametro error entra en el middleware notfound.
// Eso quiere decir que no ha hecho match con ningun controlador y no ha habido error en ellas.
// Cuando entra en el handleErrors es pq se ha hecho un next desde alguno de los controladores y se le ha pasado
// el error como parametro


// De esta manera devuelve el valor que primero encuentre
const PORT = env.first(["PORT", "HTTP_PORT"], 8080);

app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})
