const sum = (a, b) => {
    return a + b
}

const average = array => {
    const reducer = (sum, item) => {
        return sum + item
    }

    return array.reduce(reducer, 0) / array.length
}

const biggest = array => {
    const reducer = (biggest, value) =>{
        return biggest > value ? biggest : value
    }
    
    return array.reduce(reducer, 0)
}

module.exports = {
    sum,
    average,
    biggest
}