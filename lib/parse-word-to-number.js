const { DamerauLevenshtein } = require('@alordash/damerau-levenshtein');
const { Expression, LoadExpressions } = require('./loader');

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
        this.#rank = Number.MAX_VALUE;
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
        let rank = 0;
        let nums;
        let isNum = false;
        let prevIsNum = false;
        for (let word of words) {
            let t = +word;
            if (Number.isInteger(t)) {
                nums = this.numberToWord(t);
                isNum = true;
                nums = [nums];
            } else {
                if ((nums = this.parseWord(word)).length > 0) {
                    isNum = false;
                }
            }
            if (nums.length > 0) {
                for (let num of nums) {
                    if (sum == 0) {
                        if (this.#rank < num.rank) {
                            result.push(this.#sum.toString());
                            this.#sum = 0;
                            this.#rank = Number.MAX_VALUE;
                        }
                        sum = num.value;
                        rank = num.rank;
                    } else {
                        if (!prevIsNum && num.rank < rank) {
                            sum += num.value;
                            rank = num.rank;
                        } else {
                            if (num.multiply_level > 0 && (num.rank < this.#rank || (this.#rank == Number.MAX_VALUE && num.rank < rank))) {
                                if (num.multiply_level > 1) {
                                    sum *= num.value;
                                    rank = num.rank;
                                } else {
                                    this.#sum += sum * num.value;
                                    this.#rank = num.rank;
                                    sum = 0;
                                    rank = 0;
                                }
                            } else {
                                result.push((this.#sum + sum).toString());
                                this.#sum = 0;
                                this.#rank = Number.MAX_VALUE;
                                sum = num.value;
                                rank = num.rank;
                            }
                        }
                    }
                    prevIsNum = isNum;
                }
            } else {
                if (sum != 0) {
                    this.#sum += sum;
                    this.#rank = Number.MAX_VALUE;
                    sum = 0;
                    rank = 0;
                }
                if (this.#sum != 0) {
                    result.push(this.#sum.toString());
                    this.#sum = 0;
                    this.#rank = Number.MAX_VALUE;
                    sum = 0;
                    rank = 0;
                }
                result.push(word);
                prevIsNum = false;
            }
        }
        if (sum != 0) {
            this.#sum += sum;
        }
        if (this.#sum != 0) {
            result.push(this.#sum.toString());
        }
        this.#sum = 0;
        this.#rank = Number.MAX_VALUE;
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