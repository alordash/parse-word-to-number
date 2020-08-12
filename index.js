const { Parser } = require('./lib/parse-word-to-number');
let parser = new Parser();
console.log(JSON.stringify(parser.parseWord("twenty-one")));
console.log(JSON.stringify(parser.parseWord("melleon")));
console.log(parser.parseString("eleven twelve trillions nine-thousand nine nine-millions eight-hundred-seventy-seven thousands six-hundred-fivety-four"));
//console.log(parser.parseString("two-hundred three-hundred four-hundred five hundreds hundred hundred hundred hundred hundred"));
console.log("exiting ...");