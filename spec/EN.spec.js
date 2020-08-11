const { Parser } = require('../lib/parse-word-to-number');

const parseStringSpecs = [
    {
        in: "две тысячи сто двадцать один триста пятнадцать сорок сорок один один сорок пятьсот семьдесят две тысячи сто десять один суп",
        out: "2121 315 40 41 1 40 572110 1 суп"
    },
    {
        in: "сто одиннадцать тысяч сто одиннадцать",
        out: "111111"
    },
    {
        in: "двести сто тридцать четыре миллиона девятьсот девяносто пять тысяч сто восемьдесят три",
        out: "200 134995183"
    },
    {
        in: "две тысячи миллионов сто один суп",
        out: "2000 1000101 суп"
    },
    {
        in: "девятьсот девяносто девять триллионов восемьсот восемьдесят восемь миллиардов семьсот семьдесят семь миллионов шестьсот шестьдесят шесть тысяч пятьсот пятьдесят пять тысяч четыреста сорок четыре бага",
        out: "999888777666555 1444 бага"
    },
    {
        in: "два миллиона триста пятьдесят тысяч сто двенадцать миллионов и еще триста шестьдесят три миллиарда миллион сто пятьдесят",
        out: "2350112 1000000 и еще 363001000150"
    },
    {
        in: "послезавтра в девять тридцать без пятнадцати сорок пять",
        out: "послезавтра в 9 30 без 15 45"
    },
    {
        in: "ответ на главный вопрос жизни вселенной и всего такого сорок два",
        out: "ответ на главный вопрос жизни вселенной и всего такого 42"
    },
    {
        in: "100 35 миллиардов 991 миллион 254 тысячи 195 двести 4",
        out: "100 35991254195 204"
    }
];

const parseWordSpecs = [
    {
        in: "zere",
        out: 0
    },
    {
        in: "two\\",
        out: 2
    },
    {
        in: "thre",
        out: 3
    },
    {
        in: "four",
        out: 4
    },
    {
        in: "fiev",
        out: 5
    },
    {
        in: "eigth",
        out: 8
    },
    {
        in: "nien",
        out: 9
    },
    {
        in: "hundrd",
        out: 100
    },
    {
        in: "thosuand",
        out: 1000
    },
    {
        in: "melleon",
        out: 1000000
    },
];

const parseWordUndefined = [
    "fish",
    "doors",
    "sofa",
    "thursday",
    "fort",
    "table",
    "though",
];

let parser = new Parser();

describe('parseString', function () {
    for(let spec of parseStringSpecs) {
        it(spec.in, function () {
            expect(parser.parseString(spec.in)).toBe(spec.out);
        });
    }
});

describe('parseWord', function () {
    for(let spec of parseWordSpecs) {
        it(spec.in, function () {
            expect(parser.parseWord(spec.in)[0].value).toBe(spec.out);
        });
    }
});

describe('parseWordUndefined', function () {
    for(let word of parseWordUndefined) {
        it(word, function () {
            expect(parser.parseWord(word).length).toBe(0);
        });
    }
});