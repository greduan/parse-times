'use strict'

const fs = require('fs')
const { createReadStream } = fs
const byline = require('byline')

const lineParser = function (line) {
  // If line is invalid, skip it
  if (!(line.match(/^IN|OUT|DISCARD/))) {
    return
  }

  const parts = line.split(':')
  const type = parts.shift()
  const date = new Date(parts.join(':'))

  return { type, date }
}

module.exports = function (filePath) {
  return new Promise(function (resolve, reject) {
    const fileStream = createReadStream(filePath, { encoding: 'utf8' })
    const linesStream = byline(fileStream)

    const parsedLines = []
    const result = parsedLines

    linesStream.on('data', (line) => result.push(lineParser(line)))
    linesStream.on('end', () => resolve(result))
    linesStream.on('error', reject)
  })
}
