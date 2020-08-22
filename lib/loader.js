const fs = require('fs');

class Expression {
    /**@type {String} */
    text;
    /**@type {Number} */
    value;
    /**@type {Number} */
    multiply_level;
    /**@type {Number} */
    limit;
    /**@type {Number} */
    rank;

    /**
     * @param {String} text 
     * @param {Number} value 
     * @param {Number} multiply_level 
     * @param {Number} limit 
     * @param {Number} rank 
     */
    constructor(text, value, multiply_level, limit, rank) {
        this.text = text;
        this.value = value
        this.multiply_level = multiply_level
        this.limit = limit
        this.rank = rank;
    }
}

class ParsingRules {
    /**@type {String} */
    separators;
    /**@type {Array.<Expression>} */
    expressions;
    
    /**
     * @param {String} separators
     * @param {Array.<Expression>} expressions 
     */
    constructor(separators, Expressions) {
        this.separators = separators;
        this.expressions = Expressions;
    }
}

/**
 * Loads expressions
 * @param {String} fileName name of file containting expressions (.csv)
 * @returns {ParsingRules} Parsing Rules
 */
function LoadExpressionsFile(fileName) {
    let raw = fs.readFileSync(`./lib/expressions/${fileName}`, { encoding: 'utf-8' }).split(/\r\n/);
    let arr = raw.slice(4);
    for (let i in arr) {
        let val = arr[i].split(';');
        arr[i] = new Expression(val[0], +val[1], +val[2], +val[3], +val[4], val[5]);
    }
    return new ParsingRules(raw.slice(2, 3)[0].split(';')[0], arr);
}

/**
 * Loads all expressions from .csv files in ./lib/expressions/
 * @returns {Array<ParsingRules>} array of expression clusters
 */
function LoadExpressions() {
    let filenames = fs.readdirSync('./lib/expressions/');
    let parsingRules = [];
    for (const filename of filenames) {
        if (filename.split('.').pop() == 'csv') {
            parsingRules.push(LoadExpressionsFile(filename));
        }
    }
    return parsingRules;
}

module.exports = {
    Expression,
    ParsingRules,
    LoadExpressionsFile,
    LoadExpressions
}