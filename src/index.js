const R = require('ramda')
const print = require('./print-report')
const printInput = require('./print-input-string')

const deepEqual = require('deep-equal')

module.exports = (inputs, output) => {
  const results = Object
        .entries(R) // Get list of all available Ramda functions
        .filter(([name, f]) => f.length === inputs.length) // Match signature length with input length
        .filter(([name]) => name !== 'unfold')
        .filter(([name, f]) => { // Test function with input and compare to desired output
          try {
            return deepEqual(f.apply({}, inputs), output)
          } catch (ex) { return false }
        })

  results.length
    ? results.forEach(async ([ func ], i) => print(inputs, output, func, i))
    : console.log(`ramda-suggest - Could not suggest a function: f(${printInput(inputs)}) → ${printInput([output])}`)
}
