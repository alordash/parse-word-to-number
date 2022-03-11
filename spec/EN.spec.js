const { parseWord, arrayParseString, joinResult } = require('../lib/parse-word-to-number');

function formIndexes(result) {
   let indexes = [];
   for(let res of result) {
      indexes.push(res.indexes);
   }
   return indexes;
}

const parseStringSpecs = [
   {
      in: "four-hundred-seventy-six-billions two hundred fity-five millions one-thousand twenty-one balloons",
      out: {
         text: "476255001021 balloons",
         indexes: [
            [0, 1, 2, 3, 4, 5, 6],
            [7]
         ]
      }
   },
   {
      in: "one two three four five six nine ten eleven twelve trillions nine-thousand nine nine-millions eight-hundred-seventy-seven thousands six-hundred-fifty-four",
      //    0   1    2     3    4   5   6    7     8     9       10           11       12        13                   14                15               16
      out: {
         text: "1 2 3 4 5 6 9 10 11 12000000009009 9877654",
         indexes: [
            [0],
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
            [7],
            [8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
         ]
      }
   },
   {
      in: "two-hundred three-hundred four-hundred five hundreds hundred hundred hundred hundred hundred",
      out: {
         text: "200 300 400 50100 10100",
         indexes: [
            [0],
            [1],
            [2],
            [3, 4, 5, 6],
            [7, 8, 9]
         ]
      }
   },
   {
      in: "fast six hundred test",
      out: {
         text: "fast 600 test",
         indexes: [
            [0],
            [1, 2],
            [3]
         ]
      }
   },
   {
      in: "12.07",
      out: {
         text: "12.07",
         indexes: [
            [0]
         ]
      }
   },
   {
      in: "zero",
      out: {
         text: "0",
         indexes:[
            [0]
         ]
      }
   },
   {
      in: "zero one zero zero one",
      out: {
         text: "0 1 0 0 1",
         indexes:[
            [0], [1], [2], [3], [4]
         ]
      }
   }
];

const parseWordSpecs = [
   {
      in: "zere",
      out: 0
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
   {
      in: "firsd",
      out: 1
   },
   {
      in: "secont",
      out: 2
   },
   {
      in: "tird",
      out: 3
   },
   {
      in: "fourt",
      out: 4
   },
   {
      in: "fifth",
      out: 5
   },
   {
      in: "sxth",
      out: 6
   },
   {
      in: "sevendth",
      out: 7
   },
   {
      in: "eigtth",
      out: 8
   },
   {
      in: "nienth",
      out: 9
   }
];

describe('EN parseString', function () {
   let i = 1;
   for (const spec of parseStringSpecs) {
      it(`${i}. ${spec.in}`, function () {
         let result = arrayParseString(spec.in);
         expect(joinResult(result)).toBe(spec.out.text);
         if (spec.out.indexes != undefined) {
            expect(formIndexes(result)).toEqual(spec.out.indexes);
         }
      });
      i++;
   }
});

describe('EN parseWord', function () {
   for (const spec of parseWordSpecs) {
      it(spec.in, function () {
         expect(parseWord(spec.in)[0].value).toBe(spec.out);
      });
   }
});