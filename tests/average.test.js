// cross-env NODE_ENV=test jest --verbose --silent tests/average.test.js

const { average } = require('../utils/for_testing')

describe.skip('average', () => {
    test('of one value', () => {
        let result = average([1])
        expect(result).toBe(1)
    })

    test('of many', () => {
        let result = average([1, 2, 3, 4, 5, 6, 7])
        expect(result).toBe(4)
    })

    test('of empty array', () => {
        let result = average([])
        expect(result).toBe(0)
    })

    test('of undefined', () => {
        let result = average()
        expect(result).toBeUndefined()
    })
})