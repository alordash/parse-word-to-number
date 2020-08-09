const { closest, distance, distanceCalculation } = require('@alordash/damerau-levenshtein');

/**
 * Loads expressions
 * @param {String} language RU | EN
 * @returns {{words: Array.<{text: String, value: Number, multiplyer: Boolean, limit: Number}>}} 0: text, 1: value, 2: multiplyer, 3: limit
 */
function LoadExpressions(language) {
    let res = require(`./expressions/${language}.json`);
    res.words.every(e =>
        [e.text, e.value, e.multiplyer, e.limit] = [e[0], e[1], e[2], e[3]]
    );
    return res;
}

class Parser {
    constructor() {
        this.calculation = new distanceCalculation('', '');
    }

    parseWord(string) {
        let expressions = LoadExpressions("RU");
        let res = [];
        for (let word of expressions.words) {
            this.calculation.strings = [string, word.text];
            let dst = this.calculation.value;
            let delta = dst / word.text.length;
            if (delta < word.limit) {
                res.push({ word: word, delta });
            }
        }
        return res;
    }
}

module.exports = {
    Parser
}