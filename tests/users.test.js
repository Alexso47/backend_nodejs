const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')

describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({ username: 'AlexsoTest', name: 'AlexTest', passwordHash })
        await user.save()
    })

    test('works as expected creating a fresh username', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'AlexsitoTesteandoUsuarios',
            name: 'AlexUea',
            password: 'Uola12345?'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('is invalid when username already exists', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'AlexsoTest',
            name: 'AlexUea',
            password: 'Uola12345?'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.errors).toContain('Error, expected `username` to be unique. Value: `AlexsoTest`')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is invalid when username has bad format', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: '-.ñ\'3fsd2',
            name: 'AlexUea',
            password: 'Uola12345?'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.errors).toContain('Username not valid')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is invalid when name has bad format', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'Alexso1234',
            name: '1235645',
            password: 'Uola12345?'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.errors).toContain('Name not valid')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is invalid when password is too short', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'Alexso1234',
            name: 'alex',
            password: '1'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.errors).toContain('Password invalid. Password must have 8 characters at least and' +
            ' include at least one lower case, one upper case, one number and one symbol')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is invalid when password has bad format', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'Alexso1234',
            name: 'alex',
            password: 'alexsotetetete'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.errors).toContain('Password invalid. Password must have 8 characters at least and' +
            ' include at least one lower case, one upper case, one number and one symbol')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is invalid when password has bad format', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'Alexso1234',
            name: 'alex',
            password: '111111111111111'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.errors).toContain('Password invalid. Password must have 8 characters at least and' +
            ' include at least one lower case, one upper case, one number and one symbol')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})