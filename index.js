const { Parser } = require('./lib/parse-word-to-number');
let parser = new Parser();
console.log(JSON.stringify(parser.parseWord("сотка")));
console.log(parser.parseString("двести 4"));
//console.log(parser.parseString("девятьсот девяносто девять триллионов восемьсот восемьдесят восемь миллиардов семьсот семьдесят семь миллионов шестьсот шестьдесят шесть тысяч пятьсот пятьдесят пять тысяч четыреста сорок четыре бага"));
//console.log(parser.parseString("один один сорок пятьсот семьдесят две тысячи сто десять один суп"));
console.log("exiting ...");