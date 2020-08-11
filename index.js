const { Parser } = require('./lib/parse-word-to-number');
let parser = new Parser();
console.log(JSON.stringify(parser.parseWord("twenty-one")));
console.log(JSON.stringify(parser.parseWord("melleon")));
console.log(parser.parseString("four-hundred-seventy-six-billions two hundred fity-five millions one-thousand twenty-one balloons"));
console.log("exiting ...");