let _ArithTokenType = class _ArithTokenType {
    //operand
    static NUMBER = 'NUMBER'; //0 ~ 9
    static NUMBER_START_CODE = ('0').codePointAt(0);
    static NUMBER_END_CODE = ('9').codePointAt(0);

    //operators
    static MINUS = '-';
    static PLUS = '+';
    static STAR = '*';
    static SLASH = '/';
    static LEFT_SELECTOR = '(';
    static RIGHT_SELECTOR = ')';

    //other
    static NONE = 'NONE';
    static SPACE = ' ';
}

let _ArithToken = class _ArithToken {

    //<selector> :== <left selector> | <right selector>
    //<operator> ::= <plus> | <minus> | <star> | <slash>
    //<operand> ::= <number>
    //<left selector> ::= '('
    //<right selector> ::= ')'
    //<plus> ::= '+'
    //<minus> ::= '-'
    //<star> ::= '*'
    //<slash> ::= '/'
    //<number> ::= '0' | '1' | '2' ... | '9'
    //<none> := ''
    //<space> := ' '

    //@param type : String [property of _ArithTokenType.XXX]
    //@param chars : [char array]
    constructor(type, chars) {
        this._type = type || '';
        this._chars = chars || [];
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
        return this._type === _ArithTokenType.LEFT_SELECTOR;
    }

    //@return boolean
    isRightSelector() {
        return this._type === _ArithTokenType.RIGHT_SELECTOR;
    }

    //@return boolean
    isPlus() {
        return this._type === _ArithTokenType.PLUS;
    }

    //@return boolean
    isMinus() {
        return this._type === _ArithTokenType.MINUS;
    }

    //@return boolean
    isStar() {
        return this._type === _ArithTokenType.STAR;
    }

    //@return boolean
    isSlash() {
        return this._type === _ArithTokenType.SLASH;
    }

    //@return boolean
    isNumber() {
        return this._type === _ArithTokenType.NUMBER;
    }

    //@return boolean
    isNone() {
        return this._type === _ArithTokenType.NONE;
    }

    //@return boolean
    isSpace() {
        return this._type === _ArithTokenType.SPACE;
    }

    //@return String
    toString() {
        return this._toString();
    }

    //@param separator : String
    //@return String
    _toString(separator) {
        return this._chars.join(separator || '');
    }
}

let _ArithTokenizer = class _ArithTokenizer {
    //@members
    _sequence = '';
    _currentIndex = -1;
    _tokens = [];

    //@param sequence : String
    constructor(sequence) {
        this._sequence = sequence || '';
    }

    //@return boolean
    hasNext() {
        var nextIdx = this._currentIndex + 1;
        return this._inRagneOf(nextIdx);
    }

    //get next token.
    //@return token or undefined
    next() {
        var idx = this._currentIndex;

        //next sentence
        var nextSentence = this._getSentence(++idx);

        //return value.
        var buffer = nextSentence.buffer,
            token = undefined;

        if (buffer.length !== 0) {
            //create new token
            token = this._createToken(nextSentence.type, nextSentence.buffer);
            //set members
            this._tokens.push(token);
        }

        //set members
        this._currentIndex = nextSentence.currentIndex;

        return token;
    }

    //get all tokens
    //@param doClone : boolean
    //@return [token array]
    all(doClone) {
        while (this.hasNext() === true) {
            this.next();
        }
        return doClone === true ? Array.of(this._tokens) : this._tokens;
    }

    //@param type : String
    //@param buffer : [char array]
    //@return _ArithToken Object : new token
    _createToken(type, buffer) {
        return new _ArithToken(type, buffer);
    }

    //@param idx
    //@return boolean
    _inRagneOf(index) {
        return (index < this._sequence.length);
    }

    //@param idx
    //@return char
    _getCharAt(index) {
        var char = undefined;

        if (this._inRagneOf(index)) {
            char = this._sequence.charAt(index);
        }

        return char;
    }

    //@param char
    //@return boolean
    _isNone(char) {
        return (char === undefined);
    }

    //@param char
    //@return boolean
    _isNumber(char) {
        var code = char.codePointAt(0);
        return (_ArithTokenType.NUMBER_START_CODE <= code && code <= _ArithTokenType.NUMBER_END_CODE);
    }

    //@param char
    //@return boolean
    _isMinus(char) {
        return (_ArithTokenType.MINUS === char);
    }

    //@param char
    //@return boolean
    _isPlus(char) {
        return (_ArithTokenType.PLUS === char);
    }

    //@param char
    //@return boolean
    _isStar(char) {
        return (_ArithTokenType.STAR === char);
    }

    //@param char
    //@return boolean
    _isSlash(char) {
        return (_ArithTokenType.SLASH === char);
    }

    //@param char
    //@return boolean
    _isLeftSelector(char) {
        return (_ArithTokenType.LEFT_SELECTOR === char);
    }

    //@param char
    //@return boolean
    _isRightSelector(char) {
        return (_ArithTokenType.RIGHT_SELECTOR === char);
    }

    //@param char
    //@return boolean
    _isSpace(char) {
        return (_ArithTokenType.SPACE === char);
    }

    //@param startIndex: number
    //@return sentence: {
    //  type: token type,
    //  currentIndex: number,
    //  buffer: [char array]
    //}
    _getSentence(startIndex) {

        var sentence = {};
        var buffer = [];
        var idx = startIndex;

        var char = this._getCharAt(idx);

        if (this._isNone(char)) {
            //is end
            sentence = {
                type: _ArithTokenType.NONE,
                currentIndex: idx,
                buffer: buffer
            };

        } else if (this._isSpace(char)) {
            //next sentence
            sentence = this._getSentence(++idx);

        } else if (this._isLeftSelector(char) || this._isRightSelector(char)) { // is '(' ')'
            buffer.push(char);

            sentence = {
                type: char,
                currentIndex: idx,
                buffer: buffer
            };

        } else if (this._isPlus(char) || this._isStar(char) || this._isSlash(char)) { // is '+' '*' '/'
            buffer.push(char);

            sentence = {
                type: char,
                currentIndex: idx,
                buffer: buffer
            };

        } else if (this._isMinus(char)) {
            var prevIdx = idx;
            var prevChar = '';

            if (this._inRagneOf(--prevIdx)) {
                //get prev char
                prevChar = this._getCharAt(prevIdx);

                //skip space.
                while (this._isSpace(prevChar) === true) {
                    prevChar = '';
                    if (this._inRagneOf(--prevIdx)) {
                        //get prev char
                        prevChar = this._getCharAt(prevIdx);
                    }
                }
            }

            //The previous character is not a number
            if (!this._isNumber(prevChar)) {
                //next sentence
                sentence = this._getSentence(++idx);

                //format is '-'+'NUMBER'+'NUMBER'+...
                buffer = [char].concat(sentence.buffer);

                idx = sentence.currentIndex;

            } else {
                buffer.push(char);
            }

            sentence = {
                type: char,
                currentIndex: idx,
                buffer: buffer
            };

        } else if (this._isNumber(char)) {
            var nextIdx = idx;
            var nextChar = '';

            //check index
            if (this._inRagneOf(++nextIdx)) {
                //next sentence
                sentence = this._getSentence(nextIdx);

                nextChar = sentence.buffer[0];
            }

            //The next character is a number
            if (this._isNumber(nextChar)) {

                //format is 'NUMBER'+'NUMBER'+...
                buffer = [char].concat(sentence.buffer);

                idx = sentence.currentIndex;

            } else {
                buffer.push(char);
            }

            sentence = {
                type: _ArithTokenType.NUMBER,
                currentIndex: idx,
                buffer: buffer
            };

        }

        return sentence;
    }

}
