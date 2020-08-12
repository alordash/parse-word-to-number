const { DamerauLevenshtein } = require('@alordash/damerau-levenshtein');
const { Expression, LoadExpressions } = require('./loader');


function numLength(num) {
    return Math.ceil(Math.log10(num + 1));
}
class Parser {
    /**
     * @type {Number}
     */
    #sum;
    /**
     * @type {Number}
     */
    #rank;
    constructor() {
        this.calculation = new DamerauLevenshtein('', '');
        this.#sum = 0;
        this.#rank = Number.MAX_SAFE_INTEGER;
    }

    /**
     * Finds most close number to a given word
     * @param {string} word
     * @returns {Array.<Expression>} word
     */
    parseWord(word) {
        let parsingRules = LoadExpressions();
        let foundExpression;
        let result = [];
        let min;
        if (word != '') {
            for (let parsingRule of parsingRules) {
                for (let separator of parsingRule.separators) {
                    let index;
                    if ((index = word.indexOf(separator)) >= 0) {
                        let divided = this.parseWord(word.substring(0, index));
                        if (typeof (divided) != 'undefined') {
                            result.push(...divided);
                        }
                        divided = this.parseWord(word.substring(index + 1));
                        if (typeof (divided) != 'undefined') {
                            result.push(...divided);
                        }
                    }
                }
                for (let expression of parsingRule.expressions) {
                    this.calculation.strings = [word, expression.text];
                    let dst = this.calculation.distance;
                    let delta = dst / expression.text.length;
                    if (delta <= expression.limit && (delta < min || typeof (min) == 'undefined')) {
                        min = delta;
                        foundExpression = expression;
                    }
                }
            }
            if (typeof (foundExpression) != 'undefined') {
                result.push(foundExpression);
            }
        }
        return result;
    }

    /**
     * Converts all words to numbers in a given string if possible
     * @param {String} string String of words separated by whitespaces
     */
    parseString(string) {
        let words = string.split(' ');
        let result = [];
        let sum = 0;
        let rank = Number.MAX_SAFE_INTEGER;
        let multiply_level = 0;
        let nums;
        let isNum = false;
        let prevIsNum = false;
        for (let word of words) {
            let t = +word;
            if (Number.isInteger(t) && word != '') {
                nums = this.numberToWord(t);
                isNum = true;
                nums = [nums];
            } else {
                if ((nums = this.parseWord(word)).length > 0) {
                    isNum = false;
                }
            }
            if (nums.length > 0) {
                let _sum = 0;
                let _rank = Number.MAX_SAFE_INTEGER;
                let _multiply_level = 0;
                let multiplyed = false;
                for (let num of nums) {
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
                    if (_rank < this.#rank) {
                        this.#sum += _sum;
                    } else {
                        if(rank < this.#rank) {
                            this.#sum += sum;
                            sum = 0;
                            rank = Number.MAX_SAFE_INTEGER;
                        }
                        result.push(this.#sum);
                        this.#sum = _sum;
                    }
                    this.#rank = _rank;
                } else if (_rank < rank && !prevIsNum) {
                    sum += _sum;
                    rank = _rank;
                } else if (_multiply_level > 0) {
                    if (_multiply_level > 1) {
                        sum *= _sum;
                        rank = _rank;
                    } else {
                        if (_rank < this.#rank) {
                            this.#sum += Math.max(1, sum) * _sum;
                            this.#rank = _rank;
                            sum = 0;
                            rank = Number.MAX_SAFE_INTEGER;
                        } else {
                            result.push((this.#sum + sum).toString());
                            sum = _sum;
                            rank = _rank;
                            this.#sum = 0;
                            this.#rank = Number.MAX_SAFE_INTEGER;
                        }
                    }
                } else {
                    if (rank < this.#rank) {
                        this.#sum += sum;
                        result.push(this.#sum);
                        this.#sum = 0;
                        this.#rank = Number.MAX_SAFE_INTEGER;
                    } else {
                        result.push(sum);
                    }
                    sum = _sum;
                    rank = _rank;
                }
                prevIsNum = isNum;
            } else {
                if (this.#sum > 0 || sum > 0) {
                    if (numLength(sum) < numLength(this.#sum)) {
                        result.push((this.#sum + sum).toString());
                    } else {
                        if (this.#sum > 0) {
                            result.push(this.#sum);
                        }
                        if (sum > 0) {
                            result.push(sum);
                        }
                    }
                }
                result.push(word);
                prevIsNum = false;
                this.#sum = 0;
                this.#rank = Number.MAX_SAFE_INTEGER;
                sum = 0;
                rank = Number.MAX_SAFE_INTEGER;
            }
        }
        if (sum != 0) {
            this.#sum += sum;
        }
        if (this.#sum != 0) {
            result.push(this.#sum.toString());
        }
        this.#sum = 0;
        this.#rank = Number.MAX_SAFE_INTEGER;
        return result.join(' ');
    }
    /**
     * @param {Number} num
     * @returns {Expression} word
     */
    numberToWord(num) {
        let word;
        let expressions = LoadExpressions("RU");
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
}

module.exports = {
    Parser
}