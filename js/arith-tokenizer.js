class _ArithTokenType {
    //operand
    static NUMBER = 'NUMBER'; //0 ~ 9
    static NUMBER_START_CODE = ('0').codePointAt(0);
    static NUMBER_END_CODE = ('9').codePointAt(0);

    //operators
    static MINUS = '-';
    static PLUS = '+';
    static STAR = '*';
    static SLASH = '/';

    //selectors
    static LEFT_SELECTOR = '(';
    static RIGHT_SELECTOR = ')';

    //other
    static NONE = 'NONE';
    static SPACE = ' ';
};

class _ArithToken {
    //@param type : String [property of _ArithTokenType.XXX]
    //@param chars : [char array]
    constructor(type, chars) {
        this._type = type || ''; //string of token type
        this._chars = chars || []; //[array of string]
    }

    //@return string
    type() {
        return this._type;
    }

    //@return [char array]
    chars() {
        return this._chars;
    }

    //@return boolean
    isSelector() {
        return this.isLeftSelector() || this.isRightSelector();
    }

    //@return boolean
    isOperator() {
        return this.isPlus() || this.isMinus() || this.isStar() || this.isSlash();
    }

    //@return boolean
    isOperand() {
        return this.isNumber();
    }

    //@return boolean
    isLeftSelector() {
        return this.type() === _ArithTokenType.LEFT_SELECTOR;
    }

    //@return boolean
    isRightSelector() {
        return this.type() === _ArithTokenType.RIGHT_SELECTOR;
    }

    //@return boolean
    isPlus() {
        return this.type() === _ArithTokenType.PLUS;
    }

    //@return boolean
    isMinus() {
        return this.type() === _ArithTokenType.MINUS;
    }

    //@return boolean
    isStar() {
        return this.type() === _ArithTokenType.STAR;
    }

    //@return boolean
    isSlash() {
        return this.type() === _ArithTokenType.SLASH;
    }

    //@return boolean
    isNumber() {
        return this.type() === _ArithTokenType.NUMBER;
    }

    //@return boolean
    isNone() {
        return this.type() === _ArithTokenType.NONE;
    }

    //@return boolean
    isSpace() {
        return this.type() === _ArithTokenType.SPACE;
    }

    //@return String
    toString() {
        return this._toString();
    }

    //@param separator : String
    //@return String
    _toString(separator) {
        return this.chars().join(separator || '');
    }
};

//@BNF
//<token> := (<number> | <operator> | <minus> | <selector>)*
//<selector> ::= '(' | ')'
//<operator> ::= '+' | '*' | '/'
//<minus> ::= '-'
//<number> ::= ('0' | '1' | '2' ... | '9') | (<none> | <minus>) <number>+
//<none> := ''
//<space> := ' '
//
//@use
//<script>
//  var sequence = '12 + 345 / (-6789 + -10234) * (5 - 6)';
//  var tokenizer = new ArithTokenizer( sequence );
//  var tokens = tokenizer.tokenize();
//  window.console.log( tokens.toString() );
///*
// -> ['12', '+', '345', '/', '(', '-6789', '+', '-10234', ')', '*', '(', '5', '-', '6', ')']
//*/
//</script>
class _ArithTokenizer {
    //@members
    _sequence = ''; //string
    _currentIndex = -1; //number
    _tokens = []; //[array of token object]

    //@param sequence : string
    constructor(sequence) {
        this._sequence = sequence || '';
    }

    //--
    //like iterator
    //--

    //@return boolean
    hasNext() {
        var nextIndex = this._currentIndex + 1;
        return this._inRagneOf(nextIndex);
    }

    //get next token.
    //@return token or undefined: next token.
    next() {
        var token = this._nextToken();
        return token;
    }

    //@param clone : boolean
    //@return [token array]: all tokens
    tokenize(clone) {
        //Process all the rest
        while (this.hasNext() === true) {
            //get next
            this.next();
        }

        //For clones, concatenate the existing token array to the new array
        return clone === true ? [].concat(this._tokens) : this._tokens;
    }

    //get next token.
    //@return token or undefined: next token.
    _nextToken() {
        var idx = this._currentIndex;

        //next sentence
        var nextSentence = this._getSentence(++idx);

        //return value.
        var type = nextSentence.type;
        var chars = nextSentence.chars;
        var index = nextSentence.currentIndex;

        //create new token
        var token = this._token(type, chars);

        if (token.isNone()) {
            //is end

            //clear
            token = undefined;
        } else {
            //Some character found

            //set members
            this._tokens.push(token);
        }

        //set members
        this._currentIndex = index;

        return token;
    }

    //@param type : String
    //@param chars : [char array]
    //@return _Token : new token
    _token(type, chars) {
        return new _ArithToken(type, chars);
    }

    //@param idx : index
    //@return boolean : Determine if index is within range.
    _inRagneOf(index) {
        return (index < this._sequence.length);
    }

    //@param idx : index
    //@return char : charactor in sequence
    _getCharAt(index) {
        var char = undefined;

        //check index.
        if (this._inRagneOf(index)) {
            //get char
            char = this._sequence.charAt(index);
        }

        return char;
    }

    //@param char
    //@return string : token type or undefined
    _asNone(char) {
        return (char === undefined) ? _ArithTokenType.NONE : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asNumber(char) {
        var code = char.codePointAt(0);
        return (_ArithTokenType.NUMBER_START_CODE <= code && code <= _ArithTokenType.NUMBER_END_CODE) ?
            _ArithTokenType.NUMBER : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asMinus(char) {
        var type = _ArithTokenType.MINUS;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asPlus(char) {
        var type = _ArithTokenType.PLUS;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asStar(char) {
        var type = _ArithTokenType.STAR;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asSlash(char) {
        var type = _ArithTokenType.SLASH;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asOperator(char) {
        var type = undefined;

        if (type = this._asPlus(char)) {
            return type;
        } else if (type = this._asStar(char)) {
            return type;
        } else if (type = this._asSlash(char)) {
            return type;
        }

        return type;
    }

    //@param char
    //@return string : token type or undefined
    _asLeftSelector(char) {
        var type = _ArithTokenType.LEFT_SELECTOR;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asRightSelector(char) {
        var type = _ArithTokenType.RIGHT_SELECTOR;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asSelector(char) {
        var type = undefined;

        if (type = this._asLeftSelector(char)) {
            return type;
        } else if (type = this._asRightSelector(char)) {
            return type;
        }

        return type;
    }

    //@param char
    //@return string : token type or undefined
    _asSpace(char) {
        var type = _ArithTokenType.SPACE;
        return (type === char) ? type : undefined;
    }

    //@param type: string. property of _ArithTokenType.XXX
    //@param currentIndex: number.
    //@param chars: [array of string]
    //@return plain object.
    _sentence(type, currentIndex, chars) {
        return {
            'type': type,
            'currentIndex': currentIndex,
            'chars': chars
        };
    }

    //@param startIndex: number
    //@return sentence: {
    //  type: token type,
    //  currentIndex: number,
    //  chars: [char array]
    //}
    _getSentence(startIndex) {
        //init
        var type = '';
        var chars = [];
        var index = startIndex;
        var sentence = this._sentence(type, index, chars);
        var char = this._getCharAt(index);

        //(Summary) Fixed an issue where calling 'Tokenizer.next ()' after reaching the end of the sequence would result in a runtime error.
        //(Details) In the state of "Tokenizer.hasNext () === false", the return value of "Tokenizer.next ()" must return "undefined". However, the argument of "Tokenizer._asNumber (char)" in the first "if" of the internal process "Tokenizer._getSentence ()" cannot be "undefined". Before that, it was changed to determine "char === undefined".
        if (type = this._asNone(char)) { //need first.
            //as end

            //create sentence.
            sentence = this._sentence(type, index, chars);

        } else if (type = this._asNumber(char)) {
            //as operand

            //---
            //If a number appears in a sequence,
            //you must search for the number in a subsequent sequence.
            //Consider two or more digits.
            //---
            let nextIdx = index;
            let nextChar = '';

            //check index
            if (this._inRagneOf(++nextIdx)) {
                //next sentence
                sentence = this._getSentence(nextIdx);

                nextChar = sentence.chars[0];
            }

            //The next character is a number
            if (this._asNumber(nextChar)) {
                //two or more digits.

                //format is 'NUMBER'+'NUMBER'+...
                chars = [char].concat(sentence.chars);

                index = sentence.currentIndex;

            } else {
                //one digits.
                chars.push(char);
            }

            //create sentence.
            sentence = this._sentence(type, index, chars);

        } else if (type = this._asSpace(char)) {
            //skip space.

            //next sentence.
            sentence = this._getSentence(++index);

        } else if (type = this._asMinus(char)) {
            //as operator or operand

            //---
            //When '-' appears in the sequence, 
            //if the sequence preceding it is not a number (if it is an operator),
            //it is necessary to search because the possibility that '-' is a negative sign cannot be discarded.
            //---
            let prevIdx = index;
            let prevChar = '';
            let prevType = '';

            //check index.
            if (this._inRagneOf(--prevIdx)) {
                //get prev char
                prevChar = this._getCharAt(prevIdx);

                //skip space.
                while (this._asSpace(prevChar)) {
                    //init
                    prevChar = '';

                    //check index.
                    if (this._inRagneOf(--prevIdx)) {
                        //get prev char
                        prevChar = this._getCharAt(prevIdx);
                    }
                }
            }

            //The previous character is not a number
            if (!(prevType = this._asNumber(prevChar))) {
                //as operand.

                //next sentence
                sentence = this._getSentence(++index);

                //format is '-'+'NUMBER'+'NUMBER'+...
                chars = [char].concat(sentence.chars);

                type = prevType;

                index = sentence.currentIndex;

                //create sentence.
                sentence = this._sentence(type, index, chars);

            } else {
                //as operator.
                chars.push(char);

                //create sentence.
                sentence = this._sentence(type, index, chars);
            }

        } else if (type = this._asOperator(char)) {
            //as operator.

            chars.push(char);

            //create sentence.
            sentence = this._sentence(type, index, chars);

        } else if (type = this._asSelector(char)) {
            //as selector.

            chars.push(char);

            //create sentence.
            sentence = this._sentence(type, index, chars);

        }

        return sentence;
    }

};
