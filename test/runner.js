'use strict'

const path = require('path')
const { resolve } = path

const parser = require('..')

const inFileNames = ['01.txt']
const expectedOutFileNames = ['01.json']

Promise
  // parse all the files
  .all(inFileNames.map((fileName) => {
    return parser(resolve(__dirname, 'ins', fileName))
  }))
  .then((results) => console.log(results))
