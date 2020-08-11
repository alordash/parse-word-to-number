const fs = require('fs');

class word {
    /**@type {String} */
    text;
    /**@type {Number} */
    value;
    /**@type {Boolean} */
    multipliable;
    /**@type {Number} */
    limit;
    /**@type {Number} */
    rank;
    constructor(text, value, multipliable, limit, rank) {
        [this.text,
        this.value,
        this.multipliable,
        this.limit,
        this.rank] = arguments;
    }
}

/**
 * Loads expressions
 * @param {String} fileName name of file containting expressions (.csv)
 * @returns {{separators: test, expressions: Array.<{text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number}>}} array of expressions
 */
function LoadExpressionsFile(fileName) {
    let raw = fs.readFileSync(`./lib/expressions/${fileName}`, { encoding: 'utf-8' }).split(/\r\n/);
    let arr = raw.slice(4);
    for (let i in arr) {
        let val = arr[i].split(';');
        arr[i] = {};
        arr[i] = new word(val[0], +val[1], +val[2] > 0, +val[3], +val[4], val[5]);
    }
    return {
        separators: raw.slice(2, 3)[0].split(';')[0],
        expressions: arr
    };
}

/**
 * Loads all expressions from .csv files in ./lib/expressions/
 * @returns {Array.<{text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number, separators: String}>} array of expressions
 */
function LoadExpressions() {
    let filenames = fs.readdirSync('./lib/expressions/');
    let expressions = [];
    for (let filename of filenames) {
        if (filename.split('.').pop() == 'csv') {
            expressions.push(...LoadExpressionsFile(filename));
        }
    }
    return expressions;
}

module.exports = {
    LoadExpressions
}