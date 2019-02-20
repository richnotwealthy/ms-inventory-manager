require('babel-register')()
const JSDOM = require('jsdom').JSDOM

let exposedProperties = ['window', 'navigator', 'document']

global.window = (new JSDOM(``)).window
global.document = window.document
Object.keys(document).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property)
        global[property] = document[property]
    }
})

global.navigator = {
    userAgent: 'node.js'
}

window.matchMedia = window.matchMedia || (() => { return { matches: false, addListener: () => {}, removeListener: () => {}, }; });

documentRef = document