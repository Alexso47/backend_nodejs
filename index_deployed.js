require('./mongo')

/* ---------------- Sentry features ---------------*/
// const Sentry = require("@sentry/node")
// const Tracing = require("@sentry/tracing")

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
const handleErrors = require('./utils/middleware/handleErrors')
const notFound = require('./utils/middleware/notFound')
// const logger = require('./middleware/logger')


// Models
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())
// Se incluye el front como static
app.use(express.static('build'))
app.use(express.static('images'))

/* ---------------- Sentry features ---------------*/
// Sentry.init({
//     dsn: "https://996346bea74144dab72e5b145f5acbc4@o538633.ingest.sentry.io/5656948",
//     integrations: [
//         // enable HTTP calls tracing
//         new Sentry.Integrations.Http({ tracing: true }),
//         // enable Express.js middleware tracing
//         new Tracing.Integrations.Express({ app }),
//     ],

//     // We recommend adjusting this value in production, or using tracesSampler
//     // for finer control
//     tracesSampleRate: 1.0,
// });

// // RequestHandler creates a separate execution context using domains, so that every
// // transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler());
// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());



// Logger middleware
// app.use(logger)

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

// // The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());

app.use(handleErrors)
// Cuando se usa un next() sin parametro error entra en el middleware notfound.
// Eso quiere decir que no ha hecho match con ningun controlador y no ha habido error en ellas.
// Cuando entra en el handleErrors es pq se ha hecho un next desde alguno de los controladores y se le ha pasado
// el error como parametro


// Usando Env (valor 3001 por defecto si no encuentra la variable PORT)
// const PORT = env.get("PORT", 3001)

// De esta manera devuelve el valor que primero encuentre
const PORT = env.first(["PORT", "HTTP_PORT"], 8080);

// Usando dotenv
// const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})

// const http = require('http')
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-type': 'application/json '})
//     response.end(JSON.stringify(notes))
// })

// app.listen(PORT)
// console.log('Server running on port', PORT)

