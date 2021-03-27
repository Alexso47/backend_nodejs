// Middleware para decir que no hemos encontrado nada error 404

module.exports = ((request, response, next) => {
    response.status(404).end()
})
