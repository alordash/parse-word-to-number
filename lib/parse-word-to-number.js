const { closest, distance, distanceCalculation } = require('@alordash/damerau-levenshtein');
const fs = require('fs');

/**
 * Loads expressions
 * @param {String} language RU | EN
 * @returns {{words: Array.<{text: String, value: Number, multiplyer: Boolean, limit: Number}>}} 0: text, 1: value, 2: multiplyer, 3: limit
 */
function LoadExpressions(language) {
    let arr = fs.readFileSync(`./lib/expressions/${language}.csv`, { encoding: 'utf-8' }).split(/\r\n/);
    arr.splice(0, 1);
    arr.splice(arr.length - 1, 1);
    for (let i in arr) {
        let val = arr[i].split(';');
        arr[i] = {};
        [arr[i].text, arr[i].value, arr[i].multiplyer, arr[i].limit, arr[i].rank] = [val[0], +val[1], +val[2], +val[3], +val[4]];
    }
    return arr;
}

class Parser {
    constructor() {
        this.calculation = new distanceCalculation('', '');
    }

    parseWord(string) {
        let expressions = LoadExpressions("RU");
        let res = [];
        for (let word of expressions) {
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