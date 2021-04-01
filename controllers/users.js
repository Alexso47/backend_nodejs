const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { isLength, isAlphanumeric, isAlpha, isStrongPassword } = require('validator')

const validateInput = (body) => {
    const { username, name, password } = body
    let errors = []
    const MIN_CHAR = 8
    const MAX_CHAR = 30

    if (!isLength(username, MIN_CHAR, MAX_CHAR)) {
        errors = [...errors, 'Username must have 8 characters at least and 15 as much']
    }
    if (!isAlphanumeric(username)) {
        errors = [...errors, 'Username not valid']
    }
    if (!isAlpha(name)) {
        errors = [...errors, 'Name not valid']
    }
    if (!isStrongPassword(password)) {
        errors = [...errors, 'Password invalid. Password must have 8 characters at least and' +
            ' include at least one lower case, one upper case, one number and one symbol']
    }
    return errors
}

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', { content: 1, date: 1 })
    response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
    const { body } = request
    const errors = validateInput(body)

    if (errors.length !== 0) {
        response.status(400).json({
            errors: errors
        })
        return;
    }

    const { username, name, password } = body

    // complejidad del hash
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }
    catch (error) {
        response.status(400).json({
            errors: error.errors.username.message
        })
    }

})

module.exports = usersRouter