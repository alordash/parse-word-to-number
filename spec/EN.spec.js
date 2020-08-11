const { Parser } = require('../lib/parse-word-to-number');

const parseStringSpecs = [
    {
        in: "four-hundred-seventy-six-billions two hundred fity-five millions one-thousand twenty-one balloons",
        out: "476255001021 balloons"
    },
    {
        in: "one two three four five six nine ten eleven twelve trillions nine-thousand nine nine-millions eight-hundred-seventy-seven thousands six-hundred-fivety-four",
        out: "1 2 3 4 5 6 9 10 11 12000000009009 9877694"
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