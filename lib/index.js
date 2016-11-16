'use strict'

const fs = require('fs')
const { createReadStream } = fs
const byline = require('byline')

const fileLineParser = (line) => {
  if (!(line.match(/^IN|OUT|DISCARD/))) {
    return
  }

  const parts = line.split(':')
  const type = parts.shift()
  const date = new Date(parts.join(':'))

  return { type, date }
}

const defaultTimerObject = {
  in: null,
  out: null,
  discarded: false,
}

const parsedLinesParser = (lines) => {
  const result = []
  let currentTimer = Object.assign({}, defaultTimerObject)

  lines.forEach((line) => {
    switch (line.type) {
      case 'IN':
        currentTimer.in = line.date
        break

      case 'OUT':
        result.push(Object.assign({}, currentTimer, {
          out: line.date,
          total: ((line.date - currentTimer.in) / 1000), // turn milliseconds into seconds
        }))
        currentTimer = Object.assign({}, defaultTimerObject)
        break

      case 'DISCARD':
        result.push(Object.assign({}, currentTimer, {
          out: line.date,
          total: ((line.date - currentTimer.in) / 1000), // turn milliseconds into seconds
          discarded: true,
        }))
        result.push(Object.assign({}, currentTimer))
        currentTimer = Object.assign({}, defaultTimerObject)
        break

      default:
        throw new Error(`Unexpected time type '${line.type}'`)
    }
  })

  return result
}

module.exports = function (filePath) {
  return new Promise(function (resolve, reject) {
    const fileStream = createReadStream(filePath, { encoding: 'utf8' })
    const linesStream = byline(fileStream)

    const parsedLines = []

    linesStream.on('data', (line) => parsedLines.push(fileLineParser(line)))
    linesStream.on('end', () => {
      const result = parsedLines.filter((a) => a)
      resolve(parsedLinesParser(result))
    })
    linesStream.on('error', reject)
  })
}
