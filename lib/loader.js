const fs = require('fs');

/**
 * Loads expressions
 * @param {String} language RU | EN
 * @returns {{words: Array.<{text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number}>}} 0: text, 1: value, 2: multipliable, 3: limit
 */
function LoadExpressions(language) {
    let arr = fs.readFileSync(`./lib/expressions/${language}.csv`, { encoding: 'utf-8' }).split(/\r\n/);
    arr.splice(0, 1);
    arr.splice(arr.length - 1, 1);
    for (let i in arr) {
        let val = arr[i].split(';');
        arr[i] = {};
        [arr[i].text, arr[i].value, arr[i].multipliable, arr[i].limit, arr[i].rank] = [val[0], +val[1], +val[2] > 0, +val[3], +val[4]];
    }
    return arr;
}

module.exports = {
    LoadExpressions
}