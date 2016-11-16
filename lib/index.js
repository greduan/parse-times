'use strict'

const fs = require('fs')
const { createReadStream } = fs
const byline = require('byline')

const outStream = process.stdout

const lineReader = function (line) {
  const result = []

  // If line is invalid, skip it
  if (!(line.match(/^IN|OUT|DISCARD/))) {
    return
  }

  const parts = line.split(':')
  const type = parts.shift()
  const date = new Date(parts.join(''))

  switch (type) {
    case 'IN':
    case 'OUT':
    case 'DISCARD':
      console.log(type)

    default:
      return
  }
}

module.exports = function (filePath) {
  return new Promise(function (resolve, reject) {
    const fileStream = createReadStream(filePath, { encoding: 'utf8' })
    const linesStream = byline(fileStream)

    linesStream.on('data', lineReader)
    linesStream.on('end', () => resolve())
    linesStream.on('error', reject)
  })
}
