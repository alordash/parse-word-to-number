const fs = require('fs');

/**
 * Loads expressions
 * @param {String} fileName name of file containting expressions (.csv)
 * @returns {{words: Array.<{text: String, value: Number, multipliable: Boolean, limit: Number, rank: Number}>}} 0: text, 1: value, 2: multipliable, 3: limit
 */
function LoadExpressionsFile(fileName) {
    let arr = fs.readFileSync(`./lib/expressions/${fileName}`, { encoding: 'utf-8' }).split(/\r\n/);
    arr.splice(0, 1);
    for (let i in arr) {
        let val = arr[i].split(';');
        arr[i] = {};
        [arr[i].text, arr[i].value, arr[i].multipliable, arr[i].limit, arr[i].rank] = [val[0], +val[1], +val[2] > 0, +val[3], +val[4]];
    }
    return arr;
}

function LoadExpressions() {
    let filenames = fs.readdirSync('./lib/expressions/');
    let expressions = [];
    for(let filename of filenames) {
        if(filename.split('.').pop() == 'csv') {
            expressions.push(...LoadExpressionsFile(filename));
        }
    }
    return expressions;
}

module.exports = {
    LoadExpressions
}