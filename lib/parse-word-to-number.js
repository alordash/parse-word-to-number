const { distance } = require('@alordash/damerau-levenshtein');
const { Expression, LoadExpressions } = require('./loader');

class ConvertedWord {
   /**@type {String} */
   text;
   /**@type {Array.<Number>} */
   indexes;

   /**@param {String} text 
    * @param {Array.<Numbe>} indexes 
    */
   constructor(text, indexes) {
      this.text = `${text}`;
      this.indexes = indexes;
   }
}

/**@param {String} word
 * @returns {Boolean} 
 */
function isInteger(word) {
   return !isNaN(word) && !isNaN(parseInt(word)) && word == (+word).toString();
}

/**@param {Number} num
 * @returns {Number} 
 */
function numLength(num) {
   return Math.ceil(Math.log10(num + 1));
}

/**
 * Finds most close number to a given word
 * @param {string} word
 * @param {Number} errorLimit errorLimit 0.0 — accept only correct words, 1.0 — accept words with error < limit for that word, bigger — increases maximum allowed error
 * @returns {Array.<Expression>} word
 */
function parseWord(word, errorLimit = 1) {
   let parsingRules = LoadExpressions();
   let foundExpression;
   let result = [];
   let min;
   if (word != '') {
      for (const parsingRule of parsingRules) {
         for (const separator of parsingRule.separators) {
            let index;
            if ((index = word.indexOf(separator)) >= 0) {
               let divided = parseWord(word.substring(0, index), errorLimit);
               if (divided != undefined) {
                  result.push(...divided);
               }
               divided = parseWord(word.substring(index + 1), errorLimit);
               if (divided != undefined) {
                  result.push(...divided);
               }
            }
         }
         for (const expression of parsingRule.expressions) {
            let dst = distance(word.toLowerCase(), expression.text);
            if (dst <= expression.limit * errorLimit && (min == undefined || dst < min)) {
               min = dst;
               foundExpression = expression;
            }
         }
      }
      if (foundExpression != undefined) {
         result.push(foundExpression);
      }
   }
   return result;
}

/**
 * Joins words in the array of converted words
 * @param {Array.<ConvertedWord>} array 
 * @returns {String}
 */
function joinResult(array) {
   let result = array[0].text.toString();
   for (let i = 1; i < array.length; i++) {
      result = `${result} ${array[i].text.toString()}`;
   }
   return result;
}

/**
 * Converts all words to numbers in a given string if possible
 * @param {String} string String of words separated by whitespaces
 * @param {Number} errorLimit errorLimit 0.0 — accept only correct words, 1.0 — accept words with error < limit for that word, bigger — increases maximum allowed error
 * @returns {String} String of words separated by whitespaces with numbers
 */
function parseString(string, errorLimit = 1) {
   let words = string.split(/ +/);
   return joinResult(parse(words, errorLimit));
}

/**
 * Converts all words to numbers in a given string if possible
 * Returns array of ConvertedWord
 * @param {String} string 
 * @param {Number} errorLimit 
 * @returns {Array.<ConvertedWord>}
 */
function arrayParseString(string, errorLimit = 1) {
   let words = string.split(/ +/);
   for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word != '\n') {
         let index = word.indexOf('\n');
         if (index != -1) {
            let p1 = word.substring(0, index);
            let p2 = word.substring(index, index + 1);
            let p3 = word.substring(index + 1);
            words.splice(i + 1, 0, p2, p3);
            words[i] = word = p1;
         }
      }
   }
   return parse(words, errorLimit);
}

function parse(words, errorLimit) {
   let result = [];
   let Sum = 0;
   let Rank = Number.MAX_SAFE_INTEGER;
   let sum = 0;
   let rank = Number.MAX_SAFE_INTEGER;
   let multiply_level = 0;
   let nums;
   let isNum = false;
   let prevIsNum = false;
   let usedWords = [];
   let divIndex = -1;
   for (let i = 0; i < words.length; i++) {
      const word = words[i];
      usedWords.push(i);
      if (isInteger(word) && word != '') {
         nums = numberToWord(+word);
         isNum = true;
         nums = [nums];
      } else {
         if ((nums = parseWord(word, errorLimit)).length > 0) {
            isNum = false;
         }
      }
      if (nums.length > 0) {
         let _sum = 0;
         let _rank = Number.MAX_SAFE_INTEGER;
         let _multiply_level = 0;
         let multiplyed = false;
         for (const num of nums) {
            if (num.rank < _rank) {
               _sum += num.value;
               _rank = num.rank;
               _multiply_level = Math.max(_multiply_level, num.multiply_level);
            } else if (num.multiply_level > 0) {
               _sum *= num.value;
               _rank = num.rank;
               _multiply_level = num.multiply_level;
               multiplyed = true;
            }
         }
         if (multiplyed && _multiply_level <= 1) {
            if (_rank < Rank) {
               Sum += _sum;
            } else {
               if (rank < Rank) {
                  Sum += sum;
                  sum = 0;
                  rank = Number.MAX_SAFE_INTEGER;
                  usedWords.splice(-1, 1);
               }
               result.push(new ConvertedWord(Sum, usedWords));
               usedWords = [i];
               Sum = _sum;
            }
            Rank = _rank;
         } else if (multiplyed && _multiply_level > 1) {
            if (rank < Rank) {
               Sum += sum;
            }
            if (_rank < Rank && Rank != Number.MAX_SAFE_INTEGER) {
               sum = _sum;
               rank = _rank;
            } else {
               sum = 0;
               rank = Number.MAX_SAFE_INTEGER;
               if (Rank < Number.MAX_SAFE_INTEGER) {
                  usedWords.splice(-1, 1);
                  result.push(new ConvertedWord(Sum, usedWords));
                  usedWords = [i];
               }
               Sum = _sum;
               Rank = _rank;
            }
         } else if (_rank < rank && !prevIsNum) {
            sum += _sum;
            rank = _rank;
            if (i > 0 && divIndex < 0) {
               divIndex = i;
            }
         } else if (_multiply_level > 0) {
            if (_multiply_level > 1 && multiply_level != _multiply_level) {
               sum *= _sum;
               rank = _rank;
               if (rank >= Rank) {
                  let leftWords = [i];
                  if (divIndex >= 0) {
                     let index = usedWords.indexOf(divIndex);
                     leftWords = usedWords.splice(index, usedWords.length - index);
                  }
                  result.push(new ConvertedWord(Sum, usedWords));
                  usedWords = leftWords;
                  Sum = 0;
                  Rank = Number.MAX_SAFE_INTEGER;
               }
            } else {
               if (_rank < Rank) {
                  Sum += Math.max(1, sum) * _sum;
                  Rank = _rank;
                  sum = 0;
                  rank = Number.MAX_SAFE_INTEGER;
               } else {
                  usedWords.splice(-1, 1);
                  result.push(new ConvertedWord(Sum + sum, usedWords));
                  usedWords = [i];
                  sum = _sum;
                  rank = _rank;
                  Sum = 0;
                  Rank = Number.MAX_SAFE_INTEGER;
               }
            }
         } else {
            if (rank < Rank) {
               Sum += sum;
               usedWords.splice(-1, 1);
               result.push(new ConvertedWord(Sum, usedWords));
               usedWords = [i];
               Sum = 0;
               Rank = Number.MAX_SAFE_INTEGER;
            } else {
               result.push(new ConvertedWord(Sum, usedWords));
               usedWords = [];
            }
            sum = _sum;
            rank = _rank;
         }
         multiply_level = _multiply_level;
         prevIsNum = isNum;
      } else {
         if (Sum > 0 || sum > 0) {
            if (numLength(sum) < numLength(Sum)) {
               usedWords.splice(-1, 1);
               result.push(new ConvertedWord(Sum + sum, usedWords));
               usedWords = [i];
            } else {
               let leftWords = usedWords;
               if (Sum > 0) {
                  if (divIndex >= 0) {
                     let index = usedWords.indexOf(divIndex);
                     leftWords = usedWords.splice(/*divIndex*/index, usedWords.length - index);
                  }
                  result.push(new ConvertedWord(Sum, usedWords));
                  usedWords = [];
               }
               if (sum > 0) {
                  leftWords.splice(-1, 1);
                  result.push(new ConvertedWord(sum, leftWords));
                  usedWords = [i];
               }
            }
         }
         result.push(new ConvertedWord(word, usedWords));
         usedWords = [];
         prevIsNum = false;
         Sum = 0;
         Rank = Number.MAX_SAFE_INTEGER;
         sum = 0;
         rank = Number.MAX_SAFE_INTEGER;
      }
   }
   if (sum != 0) {
      Sum += sum;
   }
   if (Sum != 0 || nums.length > 0) {
      result.push(new ConvertedWord(Sum, usedWords));
   }
   return result;
}

/**
 * @param {Number} num
 * @returns {Expression} word
 */
function numberToWord(num) {
   let word;
   let expressions = LoadExpressions();
   let found = false;
   let i = 0;
   while (!found && i < expressions.length) {
      let expression = expressions[i];
      if (num == expression.value) {
         word = expression;
         found = true;
      }
      i++;
   }
   if (!found) {
      word = {
         text: "",
         value: num,
         multipliable: 0,
         limit: 0,
         rank: num.toString().length
      }
   }
   return word;
}

module.exports = {
   parseWord,
   parseString,
   arrayParseString,

   joinResult
}