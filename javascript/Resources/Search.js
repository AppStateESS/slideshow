const fuzzysort = require('fuzzysort')

export const fuzzySearch = (a, b) => {
    return fuzzysort.single(a, b)
}