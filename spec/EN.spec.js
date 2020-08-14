const { Parser } = require('../lib/parse-word-to-number');

const parseStringSpecs = [
    {
        in: "four-hundred-seventy-six-billions two hundred fity-five millions one-thousand twenty-one balloons",
        out: "476255001021 balloons"
    },
    {
        in: "one two three four five six nine ten eleven twelve trillions nine-thousand nine nine-millions eight-hundred-seventy-seven thousands six-hundred-fifty-four",
        out: "1 2 3 4 5 6 9 10 11 12000000009009 9877654"
    },
    {
        //TODO: leeave separated values alone
        in: "two-hundred three-hundred four-hundred five hundreds hundred hundred hundred hundred hundred",
        out: "200 300 400 50100 10100"
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

describe('EN parseString', function () {
    let i = 1;
    for(let spec of parseStringSpecs) {
        it(`${i}. ${spec.in}`, function () {
            expect(parser.parseString(spec.in)).toBe(spec.out);
        });
        i++;
    }
});

describe('EN parseWord', function () {
    for(let spec of parseWordSpecs) {
        it(spec.in, function () {
            expect(parser.parseWord(spec.in)[0].value).toBe(spec.out);
        });
    }
});

describe('EN parseWordUndefined', function () {
    let i = 1;
    for(let word of parseWordUndefined) {
        it(`${i}. ${word}`, function () {
            expect(parser.parseWord(word).length).toBe(0);
        });
        i++;
    }
});