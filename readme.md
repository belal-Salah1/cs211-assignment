const INT_LIT = 10;  // Token code for integer literals
const IDENT = 11;    // Token code for identifiers
const ASSIGN_OP = 20;   // Token code for assignment operator '='
const ADD_OP = 21;  // Token code for addition operator '+'
const SUB_OP = 22;  // Token code for subtraction operator '-'
const MULT_OP = 23;   // Token code for multiplication operator '*'
const DIV_OP = 24;    // Token code for division operator '/'
const LEFT_PAREN = 25;  // Token code for left parenthesis '('
const RIGHT_PAREN = 26;  // Token code for right parenthesis ')'
const UNKNOWN = 99;   // Token code for unknown characters
const EOF = -1;  // Token code for end 

const LETTER = 0;  // Character class for letters
const DIGIT = 1;  // Character class for digits
const UNKNOWN_CHAR = 99;   // Character class for unknown characters

let charClass;  // Current character class
let lexeme = Array(100).fill('');   // Array to hold the current lexeme
let nextChar = '';  // Next character to be processed
let lexLen = 0;  // Length of the current lexeme
let token;  // Current token
let nextToken;   // Next token to be processed
let inFp = null;    // Input file pointer


//Retrieves the name of the token based on its code.
function getTokenName(tokenCode) {
    //tokenCode: The code of the token.
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



//Identifies the token type based on the character provided.
function lookup(ch) {
    //ch: The character to be analyzed.
  switch (ch) {
    case '(':
      addChar(); //Adds the current character to the lexeme.
      nextToken = LEFT_PAREN; //determine the next token
      break;
    case ')':
      addChar();//Adds the current character to the lexeme.
      nextToken = RIGHT_PAREN; //determine the next token
      break;
    case '+':
      addChar(); //Adds the current character to the lexeme.
      nextToken = ADD_OP; //determine the next token
      break;
    case '-':
      addChar(); //Adds the current character to the lexeme.
      nextToken = SUB_OP; //determine the next token
      break;
    case '*':
      addChar(); //Adds the current character to the lexeme.
      nextToken = MULT_OP; //determine the next token
      break;
    case '/':
      addChar(); //Adds the current character to the lexeme.
      nextToken = DIV_OP; //determine the next token
      break;
    case '=':
      addChar(); //Adds the current character to the lexeme.
      nextToken = ASSIGN_OP; //determine the next token
      break;
    default:
      addChar(); //Adds the current character to the lexeme.
      nextToken = UNKNOWN; //determine the next token
      break;
  }
  return nextToken;
}


//Adds the current character to the lexeme.
function addChar() {
  if (lexLen <= 98) {
    lexeme[lexLen++] = nextChar; //go to the next char
    lexeme[lexLen] = '\0'; //add string terminator
  } else {
    console.error("Error - lexeme is too long"); //print error if the lexem is too long
  }
}


//Reads the next character from the input and determines its class.
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
    charClass = EOF;  //Reached end of input
    nextChar = 'EOF';  //Set EOF as next character
  }
}


 //Skips over any whitespace characters in the input
function getNonBlank() {
  while (isSpace(nextChar)) {
    getChar(); //Keep reading characters until a non-space is found
  }
}

//Performs lexical analysis to identify the next token.
//Return The token code of the next token.
function lex() {
  lexLen = 0; //Reset lexeme length
  getNonBlank(); //Skip any spaces
  switch (charClass) {
    case LETTER:
      addChar(); //Start building an identifier
      getChar();
      while (charClass === LETTER || charClass === DIGIT) {
        addChar(); //Keep building the identifier
        getChar();
      }
      nextToken = IDENT;
      break;
    case DIGIT:
      addChar(); //Start building an integer literal
      getChar();
      while (charClass === DIGIT) {
        addChar();
        getChar();
      }
      nextToken = INT_LIT;
      break;
    case UNKNOWN_CHAR:
      lookup(nextChar); //Try to recognize the unknown character as a token
      getChar();  //Move to next character
      break;
    case EOF: //Reached the end
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
  return nextToken; //Return the token
}

//Checks if the character is an alphabetic letter.
//Return true if c is a letter, otherwise false.
function isAlpha(c) {
  return typeof c === 'string' && /^[a-zA-Z]$/.test(c); //Check if single letter
}

//Checks if the character is a digit.
function isDigit(c) {
  return typeof c === 'string' && /^[0-9]$/.test(c); //Check if it's a space/tab/newline
}

//Checks if the character is a whitespace character.
function isSpace(c) {
  return typeof c === 'string' && /\s/.test(c);
}

function main(inputText) {
  console.log(`Analyzing: "${inputText}"\n`);
  lexeme = Array(100).fill(''); //Reset lexeme array
  lexLen = 0; //Reset lexeme length
  nextChar = '';  //Clear current char
  inFp = { data: inputText, position: 0 }; //Initialize input pointer
  getChar();  //Read first character
  do {
    nextToken = lex();
  } while (nextToken !== EOF);  //Keep analyzing tokens
  console.log("\nAnalysis complete\n");
}


//Tests the lexer with a specific expression and outputs the results.
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
testWithExpression("a & b ? c : d");
"# cs211-assignment" 
