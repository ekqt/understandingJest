const hf = require('../utils/helper_functions')
const db = require('../db.json')

const macbookPro = db.laptops.find(laptop => laptop.name === "Macbook Pro 13")

describe('What is the', () => {
    test('...sum value', () => {
        const result = hf.sum(5, 5)
        console.log(`The sum result is: ${result}`)
        expect(result).toEqual(10)
    })
    test('...average value', () => {
        const result = hf.average([5, 5, 5, 5, 5])
        console.log(`The average result is: ${result}`)
        expect(result).toEqual(5)
    })
    test('...biggest value', () => {
        const result = hf.biggest([1, 15, 3, 2, 4])
        console.log(`The biggest result is: ${result}`)
        expect(result).toEqual(15)
    })
})

describe('The latest Macbook Pro is', () => {
    test('...very expensive', () => {
        expect(macbookPro.price.currency).toBe('USD')
        expect(macbookPro.price.amount).toBeGreaterThan(1000)
    })

    test('...probably the only computer with normal ports', () => {
        expect(macbookPro.onlyHasUSBTypeC).toBe(true)
    })

    test('...at least some builtInApps for free', () => {
        expect(macbookPro).toHaveProperty('builtInApps', ["Siri", "Safari", "Messages", "Facetime"])
    })
})