const { parseWord, parseString } = require('../lib/parse-word-to-number');

const parseStringSpecs = [
   {
      in: "две тысячи сто двадцать один триста пятнадцать сорок сорок один один сорок пятьсот семьдесят две тысячи сто десять один суп",
      out: {
         text: "2121 315 40 41 1 40 572110 1 суп",
         indexes: [
            [0, 1, 2, 3, 4],
            [5, 6],
            [7],
            [8, 9],
            [10],
            [11],
            [12, 13, 14, 15, 16, 17],
            [18],
            [19]
         ]
      }
   },
   {
      in: "сто одиннадцать тысяч сто одиннадцать",
      out: {
         text: "111111"
      }
   },
   {
      in: "двести сто тридцать четыре миллиона девятьсот девяносто пять тысяч сто восемьдесят три",
      out: {
         text: "200 134995183"
      }
   },
   {
      in: "две  тысячи  миллионов сто один суп",
      out: {
         text: "2000 1000101 суп"
      }
   },
   {
      in: "девятьсот девяносто девять триллионов восемьсот  восемьдесят восемь миллиардов семьсот семьдесят семь миллионов шестьсот шестьдесят шесть тысяч пятьсот пятьдесят пять тысяч четыреста сорок четыре бага",
      //    0           1        2        3           4           5        6        7        8        9      10      11       12        13       14    15      16       17    18    19      20     21     22    23
      out: {
         text: "999888777666555 1444 бага"
      }
   },
   {
      in: "два миллиона     триста пятьдесят тысяч сто двенадцать миллионов и еще триста шестьдесят три миллиарда миллион сто пятьдесят",
      out: {
         text: "2350112 1000000 и еще 363001000150"
      }
   },
   {
      in: "послезавтра в девять тридцать без пятнадцати сорок пять",
      out: {
         text: "послезавтра в 9 30 без 15 45"
      }
   },
   {
      in: "ответ на главный вопрос жизни  вселенной и всего такого сорок два",
      out: {
         text: "ответ на  главный вопрос жизни вселенной и всего такого 42"
      }
   },
   {
      in: "100 35 миллиардов 991 миллион 254  тысячи 195 двести 4",
      out: {
         text: "100 35991254195 204"
      }
   },
   {
      in: "nine hundred девяносто  nine миллиардов   two hundred  пятьдесят six миллионов seven hundred thirty два thousands one hundred одиннадцать",
      out: {
         text: "999256732111"
      }
   }
];

const parseWordSpecs = [
   {
      in: "нуль",
      out: 0
   },
   {
      in: "одын",
      out: 1
   },
   {
      in: "две",
      out: 2
   },
   {
      in: "три",
      out: 3
   },
   {
      in: "читырэ",
      out: 4
   },
   {
      in: "уосэмь",
      out: 8
   },
   {
      in: "дивят",
      out: 9
   },
   {
      in: "сотка",
      out: 100
   },
   {
      in: "тыщи",
      out: 1000
   },
   {
      in: "мелеон",
      out: 1000000
   },
   {
      in: "пирвый",
      out: 1
   },
   {
      in: "втаролй",
      out: 2
   },
   {
      in: "тритий",
      out: 3
   },
   {
      in: "четвертый",
      out: 4
   },
   {
      in: "пятьй",
      out: 5
   },
   {
      in: "шистой",
      out: 6
   },
   {
      in: "седмой",
      out: 7
   },
   {
      in: "уосмой",
      out: 8
   },
   {
      in: "дивятый",
      out: 9
   }
];

const parseWordUndefined = [
   "рыба",
   "двери",
   "диван",
   "четверг",
   "семья",
   "сорока",
   "стол",
   "тычка",
];

function formatSpecOut(string) {
   return string.replace(/  +/g, ' ');
}

describe('RU parseString', function () {
   let i = 1;
   for (const spec of parseStringSpecs) {
      it(`${i}. ${spec.in}`, function () {
         var result = parseString(spec.in);
         expect(result.string).toBe(formatSpecOut(spec.out.text));
         if(typeof(spec.out.indexes) != 'undefined') {
            expect(result.indexes).toEqual(spec.out.indexes);
         }
      });
      i++;
   }
});

describe('RU parseWord', function () {
   for (const spec of parseWordSpecs) {
      it(spec.in, function () {
         expect(parseWord(spec.in)[0].value).toBe(spec.out);
      });
   }
});

describe('RU parseWordUndefined', function () {
   let i = 1;
   for (const word of parseWordUndefined) {
      it(`${i}. ${word}`, function () {
         expect(parseWord(word).length).toBe(0);
      });
      i++;
   }
});

describe('RU parseCorrectWord', function () {
   it('1', function () {
      expect(parseWord("один", 0)[0].value).toBe(1);
      expect(parseWord("одын", 0).length).toBe(0);
   });
});