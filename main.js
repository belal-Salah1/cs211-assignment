const INT_LIT = 10;
const IDENT = 11;
const ASSIGN_OP = 20;
const ADD_OP = 21;
const SUB_OP = 22;
const MULT_OP = 23;
const DIV_OP = 24;
const LEFT_PAREN = 25;
const RIGHT_PAREN = 26;
const UNKNOWN = 99;
const EOF = -1;

const LETTER = 0;
const DIGIT = 1;
const UNKNOWN_CHAR = 99;

let charClass;
let lexeme = Array(100).fill('');
let nextChar = '';
let lexLen = 0;
let token;
let nextToken;
let inFp = null;

function getTokenName(tokenCode) {
  const tokenNames = {
    10: "INT_LIT",
    11: "IDENT",
    20: "ASSIGN_OP",
    21: "ADD_OP",
    22: "SUB_OP",
    23: "MULT_OP",
    24: "DIV_OP",
    25: "LEFT_PAREN",
    26: "RIGHT_PAREN",
    99: "UNKNOWN",
    [-1]: "EOF"
  };
  return tokenNames[tokenCode] || tokenCode.toString();
}

function lookup(ch) {
  switch (ch) {
    case '(':
      addChar();
      nextToken = LEFT_PAREN;
      break;
    case ')':
      addChar();
      nextToken = RIGHT_PAREN;
      break;
    case '+':
      addChar();
      nextToken = ADD_OP;
      break;
    case '-':
      addChar();
      nextToken = SUB_OP;
      break;
    case '*':
      addChar();
      nextToken = MULT_OP;
      break;
    case '/':
      addChar();
      nextToken = DIV_OP;
      break;
    case '=':
      addChar();
      nextToken = ASSIGN_OP;
      break;
    default:
      addChar();
      nextToken = UNKNOWN;
      break;
  }
  return nextToken;
}

function addChar() {
  if (lexLen <= 98) {
    lexeme[lexLen++] = nextChar;
    lexeme[lexLen] = '\0';
  } else {
    console.error("Error - lexeme is too long");
  }
}

function getChar() {
  if (inFp && inFp.position < inFp.data.length) {
    nextChar = inFp.data[inFp.position++];
    if (isAlpha(nextChar)) {
      charClass = LETTER;
    } else if (isDigit(nextChar)) {
      charClass = DIGIT;
    } else {
      charClass = UNKNOWN_CHAR;
    }
  } else {
    charClass = EOF;
    nextChar = 'EOF';
  }
}

function getNonBlank() {
  while (isSpace(nextChar)) {
    getChar();
  }
}

function lex() {
  lexLen = 0;
  getNonBlank();
  switch (charClass) {
    case LETTER:
      addChar();
      getChar();
      while (charClass === LETTER || charClass === DIGIT) {
        addChar();
        getChar();
      }
      nextToken = IDENT;
      break;
    case DIGIT:
      addChar();
      getChar();
      while (charClass === DIGIT) {
        addChar();
        getChar();
      }
      nextToken = INT_LIT;
      break;
    case UNKNOWN_CHAR:
      lookup(nextChar);
      getChar();
      break;
    case EOF:
      nextToken = EOF;
      lexeme[0] = 'E';
      lexeme[1] = 'O';
      lexeme[2] = 'F';
      lexeme[3] = '\0';
      lexLen = 3;
      break;
  }
  const lexemeStr = lexeme.slice(0, lexLen).join('').replace('\0', '');
  console.log(`Next token is: ${nextToken} (${getTokenName(nextToken)}), Next lexeme is ${lexemeStr}`);
  return nextToken;
}

function isAlpha(c) {
  return typeof c === 'string' && /^[a-zA-Z]$/.test(c);
}

function isDigit(c) {
  return typeof c === 'string' && /^[0-9]$/.test(c);
}

function isSpace(c) {
  return typeof c === 'string' && /\s/.test(c);
}

function main(inputText) {
  console.log(`Analyzing: "${inputText}"\n`);
  lexeme = Array(100).fill('');
  lexLen = 0;
  nextChar = '';
  inFp = { data: inputText, position: 0 };
  getChar();
  do {
    nextToken = lex();
  } while (nextToken !== EOF);
  console.log("\nAnalysis complete\n");
}

function testWithExpression(expression) {
  console.log(`Testing expression: "${expression}"\n`);
  lexeme = Array(100).fill('');
  lexLen = 0;
  nextChar = '';
  inFp = { data: expression, position: 0 };
  getChar();
  let results = [];
  do {
    nextToken = lex();
    results.push({
      token: nextToken,
      tokenName: getTokenName(nextToken),
      lexeme: lexeme.slice(0, lexLen).join('').replace('\0', '')
    });
  } while (nextToken !== EOF);
  console.log("\nSummary of tokens:");
  results.forEach((result, index) => {
    if (result.token !== EOF) {
      console.log(`${index + 1}. Token: ${result.tokenName} (${result.token}), Lexeme: ${result.lexeme}`);
    }
  });
  console.log("\nEnd of analysis\n");
}

console.log("LEXICAL ANALYZER TEST");
console.log("=====================");
testWithExpression("(sum + 47) / total");
testWithExpression("x = y * (z - 5)");
