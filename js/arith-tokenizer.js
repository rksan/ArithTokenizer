let _ArithToken = class _ArithToken {
    //@param type : String
    //@param chars : [char array]
    constructor(type, chars) {
        this.type = type || '';
        this.chars = chars || [];
    }

    //@return String
    toString() {
        return this._toString();
    }

    //@param separator : String
    //@return String
    _toString(separator) {
        return this.chars.join(separator || '');
    }
}
let _ArithTokenizer = class _ArithTokenizer {
    //@members
    TOKEN_TYPE_NONE = 'NONE';
    TOKEN_TYPE_NUMBER = 'NUMBER';
    TOKEN_TYPE_MINUS = '-';
    TOKEN_TYPE_PLUS = '+';
    TOKEN_TYPE_STAR = '*';
    TOKEN_TYPE_SLASH = '/';
    TOKEN_TYPE_LEFT_SELECTOR = '(';
    TOKEN_TYPE_RIGHT_SELECTOR = ')';
    TOKEN_TYPE_SPACE = ' ';
    NUMBER_START_CODE = ('0').codePointAt(0);
    NUMBER_END_CODE = ('9').codePointAt(0);

    //@param sequence : String
    constructor(sequence) {
        this.sequence = sequence || '';
        this.currentIndex = -1;
        this.tokens = [];
    }

    //@return boolean
    hasNext() {
        var nextIdx = this.currentIndex + 1;
        return this._inRagneOf(nextIdx);
    }

    //get next token.
    //@return token or undefined
    next() {
        var idx = this.currentIndex;

        //next sentence
        var nextSentence = this._getSentence(++idx);

        //return value.
        var buffer = nextSentence.buffer,
            token = undefined;

        if (buffer.length !== 0) {
            //create new token
            token = this._createToken(nextSentence.type, nextSentence.buffer);
            //set members
            this.tokens.push(token);
        }

        //set members
        this.currentIndex = nextSentence.currentIndex;

        return token;
    }

    //get all tokens
    //@return 
    all() {
        while (this.hasNext() === true) {
            this.next();
        }
        return this.tokens;
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
        return (index < this.sequence.length);
    }

    //@param idx
    //@return char
    _getCharAt(index) {
        var char = undefined;

        if (this._inRagneOf(index)) {
            char = this.sequence.charAt(index);
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
        return (this.NUMBER_START_CODE <= code && code <= this.NUMBER_END_CODE);
    }

    //@param char
    //@return boolean
    _isMinus(char) {
        return (this.TOKEN_TYPE_MINUS === char);
    }

    //@param char
    //@return boolean
    _isPlus(char) {
        return (this.TOKEN_TYPE_PLUS === char);
    }

    //@param char
    //@return boolean
    _isStar(char) {
        return (this.TOKEN_TYPE_STAR === char);
    }

    //@param char
    //@return boolean
    _isSlash(char) {
        return (this.TOKEN_TYPE_SLASH === char);
    }

    //@param char
    //@return boolean
    _isLeftSelector(char) {
        return (this.TOKEN_TYPE_LEFT_SELECTOR === char);
    }

    //@param char
    //@return boolean
    _isRightSelector(char) {
        return (this.TOKEN_TYPE_RIGHT_SELECTOR === char);
    }

    //@param char
    //@return boolean
    _isSpace(char) {
        return (this.TOKEN_TYPE_SPACE === char);
    }

    //@param startIndex: number
    //@return sentence: {
    //  type: token type,
    //  currentIndex: number,
    //  buffer: [char array]
    //}
    _getSentence(startIndex) {

        var sentence = {},
            buffer = [],
            idx = startIndex;

        var char = this._getCharAt(idx);

        if (this._isNone(char)) {
            //is end
            sentence = {
                type: this.TOKEN_TYPE_NONE,
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
            var prevIdx = idx,
                prevChar = '';

            if (this._inRagneOf(--prevIdx)) {
                //get prev char
                prevChar = this._getCharAt(prevIdx);
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
            var nextIdx = idx,
                nextChar = '';

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
                type: this.TOKEN_TYPE_NUMBER,
                currentIndex: idx,
                buffer: buffer
            };

        }

        return sentence;
    }

}
