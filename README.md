# @alordash/parse-word-to-number

```
$ npm i @alordash/parse-word-to-number
```  

# Description

Parses string and returns numbers written as words inside it.  
It uses my realization of [Damerau-Levenshtein algorithm](https://github.com/alordash/damerau-levenshtein) to properly parse words even if they are written with mistakes.  
**Supports Russian and English language.**

# Usage

### Function parseWord(string, errorLimit):{Array.\<Number\>}  
#### Arguments
1. string {**String**} — source string.  
2. errorLimit {**Number**} — From 0.0 to 1.0, the less — the less results. Used for recognizing words with mistakes.  
Parses all words in that string into numbers.  
Returns all found numbers.  
#### Usage example:

```javascript
const { parseWord } = require('@alordash/parse-word-to-number');

//Parse single word
let parsedWord = parseWord("twonty-one");
console.log(parsedWord[0].value);
//=> 20
console.log(parsedWord[1].value);
//=> 1

parsedWord = parseWord("читырэ");
console.log(parsedWord[0].value);
//=> 4

//You can specify mistakes multiplication from 0.0 and on with second argument, where
//0 — do not accept words with mistakes,
//1 — accept words if error < error limit for that word
//List of limits for all words is located in /lib/expressions/*.csv files
parsedWord = parseWord("hundrid", 1);
console.log(parserWord[0].value);
//=> 100

parsedWord = parseWord("hundrid", 0);
console.log(parserWord[0]);
//=> undefined
```


### Function parseString(string, errorLimit):{String}  
#### Arguments
1. string {**String**} — source string.  
2. errorLimit {**Number**} — From 0.0 to 1.0, the less — the less results. Used for recognizing words with mistakes.  
Parses all words in that string into numbers and combines them.  
Returns string with parsed numbers.  
#### Usage example:
  
```javascript
const { parseString } = require('@alordash/parse-word-to-number');

console.log(parseString("four-huntred-sevinty-six balloons"));
//=> 476 balloons

console.log(parseString("двести дивяносто пят тысоч ложек сто восмьдесят три тарелки"));
//=> 295000 ложек 183 тарелки

//Mistakes multiplication
console.log(parseString("four-huntred-sevinty-six balloons", 0));
//=> 4 balloons

console.log(parseString("двести дивяносто пят тысоч ложек сто восмьдесят три тарелки", 0));
//=> 200 дивяносто пят тысоч ложек 100 восмьдесят 3 тарелки
```

# Adding custom expressions

You can add new expressions for parsing more cases by creating .csv file inside [lib/expressions](https://github.com/alordash/parse-word-to-number/tree/master/lib/expressions) folder.
Fill new .csv file with following format:
```
META;;;;
separators;;;;
%separators_symbols% (for example I'm using "-" as separator for English);;;;
text;value;multiply level;errors limit;rank
String;Number;Number;Number;Number
```
For better understanding see example .csv files located in [lib/expressions](https://github.com/alordash/parse-word-to-number/tree/master/lib/expressions) folder.
