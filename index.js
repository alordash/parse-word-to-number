const { Parser } = require('./lib/parse-word-to-number');
let parser = new Parser();
console.log(JSON.stringify(parser.parseWord("сотка")));
console.log(JSON.stringify(parser.parseWord("melleon")));
console.log(parser.parseString("ответ на главный вопрос жизни вселенной и всего такого сорок два"));
//console.log(parser.parseString("две тысячи сто двадцать один триста пятнадцать сорок сорок один один сорок пятьсот семьдесят две тысячи сто десять один суп"));
//console.log(parser.parseString("100 35 миллиардов 991 миллион 254 тысячи 195 двести 4"));
//console.log(parser.parseString("девятьсот девяносто девять триллионов восемьсот восемьдесят восемь миллиардов семьсот семьдесят семь миллионов шестьсот шестьдесят шесть тысяч пятьсот пятьдесят пять тысяч четыреста сорок четыре бага"));
//console.log(parser.parseString("один один сорок пятьсот семьдесят две тысячи сто десять один суп"));
console.log("exiting ...");