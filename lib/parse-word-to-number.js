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
     * @returns {{word: {text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number}, delta: Number}} word and delta
     */
    parseWord(word) {
        let expressions = LoadExpressions("RU");
        let result;
        let min;
        for (let expression of expressions) {
            this.calculation.strings = [word, expression.text];
            let dst = this.calculation.distance;
            let delta = dst / expression.text.length;
            if (delta <= expression.limit && (delta < min || typeof (min) == 'undefined')) {
                min = delta;
                result = { word: expression, delta };
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
        let num;
        for (let word of words) {
            if (!isNaN(word)) {
                num.word.value = +word;
                num.word.rank = word.length;
            } else {
                num = this.parseWord(word);
            }
            if (typeof (num) != 'undefined') {
                if (sum == 0) {
                    if (this.#rank < num.word.rank) {
                        resWords.push(this.#sum.toString());
                        this.#sum = 0;
                        this.#rank = Number.MAX_VALUE;
                    }
                    sum = num.word.value;
                    rank = num.word.rank;
                } else {
                    if (num.word.rank < rank) {
                        sum += num.word.value;
                        rank = num.word.rank;
                    } else {
                        if (num.word.multipliable && (num.word.rank < this.#rank || (this.#rank == Number.MAX_VALUE && num.word.rank < rank))) {
                            this.#sum += sum * num.word.value;
                            this.#rank = num.word.rank;
                            sum = 0;
                            rank = 0;
                        } else {
                            resWords.push((this.#sum + sum).toString());
                            this.#sum = 0;
                            this.#rank = Number.MAX_VALUE;
                            sum = num.word.value;
                            rank = num.word.rank;
                        }
                    }
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
}

module.exports = {
    Parser
}