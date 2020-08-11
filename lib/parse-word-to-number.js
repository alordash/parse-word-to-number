const { closest, distance, DamerauLevenshtein } = require('@alordash/damerau-levenshtein');
const { LoadExpressions } = require('./loader');

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
     * @returns {Array.<{text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number, delta: Number}>} word and delta
     */
    parseWord(word) {
        let expressions = LoadExpressions();
        let result = [];
        let min;
        for (let expression of expressions) {
            for (let separator of expression.separators) {
                if (word.indexOf(separator) >= 0) {

                }
            }
            this.calculation.strings = [word, expression.text];
            let dst = this.calculation.distance;
            let delta = dst / expression.text.length;
            if (delta <= expression.limit && (delta < min || typeof (min) == 'undefined')) {
                min = delta;
                result = [{ ...expression, delta }];
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
        let resWords = [];
        let sum = 0;
        let rank = 0;
        let nums;
        let prevIsNum = false;
        for (let word of words) {
            let t = +word;
            if (Number.isInteger(t)) {
                nums = this.numberToWord(t);
                nums.isNum = true;
                nums = [nums];
            } else {
                if ((nums = this.parseWord(word)).length > 0) {
                    nums[0].isNum = false;
                }
            }
            if (nums.length > 0) {
                for (let num of nums) {
                    if (sum == 0) {
                        if (this.#rank < num.rank) {
                            resWords.push(this.#sum.toString());
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
                            if (num.multipliable && (num.rank < this.#rank || (this.#rank == Number.MAX_VALUE && num.rank < rank))) {
                                this.#sum += sum * num.value;
                                this.#rank = num.rank;
                                sum = 0;
                                rank = 0;
                            } else {
                                resWords.push((this.#sum + sum).toString());
                                this.#sum = 0;
                                this.#rank = Number.MAX_VALUE;
                                sum = num.value;
                                rank = num.rank;
                            }
                        }
                    }
                    prevIsNum = num.isNum;
                }
            } else {
                if (sum != 0) {
                    this.#sum += sum;
                    this.#rank = Number.MAX_VALUE;
                    sum = 0;
                    rank = 0;
                }
                if (this.#sum != 0) {
                    resWords.push(this.#sum.toString());
                    this.#sum = 0;
                    this.#rank = Number.MAX_VALUE;
                    sum = 0;
                    rank = 0;
                }
                resWords.push(word);
                prevIsNum = false;
            }
        }
        if (sum != 0) {
            this.#sum += sum;
        }
        if (this.#sum != 0) {
            resWords.push(this.#sum.toString());
        }
        this.#sum = 0;
        this.#rank = Number.MAX_VALUE;
        return resWords.join(' ');
    }

    /**
     * @param {Number} num
     * @returns {{word: {text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number}} word
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
                multipliable: false,
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