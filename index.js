const { Parser } = require('./lib/parse-word-to-number');
let parser = new Parser();
console.log(JSON.stringify(parser.parseWord("одын")));
const fs = require('fs');
let table = fs.readFileSync('./lib/expressions/Expressions - RU.csv', { encoding: 'utf8' }).split(/\r\n/);
console.log(table);
console.log("exiting ...");