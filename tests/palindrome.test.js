// cross-env NODE_ENV=test jest --verbose --silent tests/palindrome.test.js

const { palindrome } = require('../utils/for_testing')

describe.skip('palindrome', () => {
    test('of Alex', () => {
        const result = palindrome('Alex')

        expect(result).toBe('xelA')
    })

    test('of empty string', () => {
        const result = palindrome('')

        expect(result).toBe('')
    })

    test('of undefined', () => {
        const result = palindrome()

        expect(result).toBeUndefined()
    })
})