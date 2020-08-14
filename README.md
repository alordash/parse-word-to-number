# @alordash/parse-word-to-number

```
$ npm i @alordash/parse-word-to-number
```  

# Description

Parses string and return numbers written as words inside it.  
It uses Damerau-Levenshtein algorithm to properly parse words even if they are written with mistakes.  
**Supports Russian and English language.**

# Usage

```javascript
const { Parser } = require('@alordash/parse-word-to-number');
let parser = new Parser();

//Parse single word
let parsedWord = parser.parseWord("twonty-one");
console.log(parsedWord[0].value);
//=> 20
console.log(parsedWord[1].value);
//=> 1

parsedWord = parser.parseWord("читырэ");
console.log(parsedWord[0].value);
//=> 4

//You can specify mistakes multiplication from 0.0, where
//0 — do not accept words mistakes,
//1 — accept words with error that is less than error limit for that word
//List of limits for all words is located in /lib/expressions/*.csv files
parsedWord = parser.parseWord("hundrid", 1);
console.log(parserWord[0].value);
//=> 100
parsedWord = parser.parseWord("hundrid", 0);
console.log(parserWord[0]);
//=> undefined

//Parse string
console.log(parser.parseString("four-huntred-sevinty-six balloons"));
//=> 476 balloons

console.log(parser.parseString("двести дивяносто пят тысоч ложек сто восмьдесят три тарелки"));
//=> 295000 ложек 183 тарелок

//Mistakes multiplication
console.log(parser.parseString("four-huntred-sevinty-six balloons", 0));
//=> 4 balloons

console.log(parser.parseString("двести дивяносто пят тысоч ложек сто восмьдесят три тарелки", 0));
//=> 200 дивяносто пят тысоч ложек 100 восмьдесят 3 тарелки
```

# Adding custom expressions to dictionary

You can add new expressions for parsing more cases by creating .csv file inside /lib/expressions folder.
Fill new .csv file with following format:
```
META;;;;
separators;;;;
%separators_symbols% (for example I'm using "-" as separator for English);;;;
text;value;multiply level;errors limit;rank
String;Number;Number;Number;Number
```
For better explanation see example .csv files located in lib/expressions folder.