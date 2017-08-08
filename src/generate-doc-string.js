const { resolve } = require
const { readFile } = require('mz/fs')

const readDoc = (docs, symbol) => docs
      .filter(line => (new RegExp(symbol)).test(line))
      .map(line => line.split(new RegExp(`^.*${symbol} `)))
      .map(([, line]) => line)

const readDescription = (docs) => docs
      .split('\n')
      .map(line => line.split('*'))
      .map(([ , text ]) => text)
      .filter(line => line && /[a-z]+/.test(line))
      .join('\n')

module.exports = async (name) => {
  const filename = resolve(`ramda/src/${name}`)
  const content = await readFile(filename, 'utf-8')
  const comment = content.split('\n').filter(line => /[ /]\*/.test(line))

  // Read JSDoc style annotations
  const [ symbol ] = readDoc(comment, '@symb')
  const [ params ] = readDoc(comment, '@param')
  const [ returns ] = readDoc(comment, '@return')
  const [ category ] = readDoc(comment, '@category')

  // Read the description at the top of the file
  const [ docComment ] = content.split('@')
  const doc = readDescription(docComment)

  return { doc, params, returns, category, symbol }
}
