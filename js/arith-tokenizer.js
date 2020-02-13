let _ArithTokenizer = class _ArithTokenizer {

    //@param sequence : String
    constructor(sequence) {
        this.sequence = sequence || '';
        this.currentIdx = -1;
        this.current = [];
        this.START_CODE = ('0').codePointAt(0);
        this.END_CODE = ('9').codePointAt(0);
    }

    //@return boolean
    hasNext() {
        var nextIdx = this.currentIdx + 1;
        return this._inRagneOf(nextIdx);
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
        return (this.START_CODE <= code && code <= this.END_CODE);
    }

    //@param char
    //@return boolean
    _isMinus(char) {
        return ('-' === char);
    }

    //@param char
    //@return boolean
    _isPlus(char) {
        return ('+' === char);
    }

    //@param char
    //@return boolean
    _isStar(char) {
        return ('*' === char);
    }

    //@param char
    //@return boolean
    _isSlash(char) {
        return ('/' === char);
    }

    //@param char
    //@return boolean
    _isLeftSelector(char) {
        return ('(' === char);
    }

    //@param char
    //@return boolean
    _isRightSelector(char) {
        return (')' === char);
    }

    //@param char
    //@return boolean
    _isSpace(char) {
        return (' ' === char);
    }

    //@param startIndex
    //@return sentence: {
    //  currentIdx: number,
    //  current: [char array]
    //}
    _getSentence(startIndex) {

        var sentence = {},
            buffer = [],
            idx = startIndex;

        var char = this._getCharAt(idx);

        if (this._isNone(char)) {
            //is end
            sentence = {
                currentIdx: idx,
                current: buffer
            };

        } else if (this._isSpace(char)) {
            //next sentence
            sentence = this._getSentence(++idx);

        } else if (this._isLeftSelector(char) || this._isRightSelector(char)) { // is '(' ')'
            buffer.push(char);

            sentence = {
                currentIdx: idx,
                current: buffer
            };

        } else if (this._isPlus(char) || this._isStar(char) || this._isSlash(char)) { // is '+' '*' '/'
            buffer.push(char);

            sentence = {
                currentIdx: idx,
                current: buffer
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
                buffer = [char].concat(sentence.current);

                idx = sentence.currentIdx;

            } else {
                buffer.push(char);
            }

            sentence = {
                currentIdx: idx,
                current: buffer
            };

        } else if (this._isNumber(char)) {
            var nextIdx = idx,
                nextChar = '';

            //check index
            if (this._inRagneOf(++nextIdx)) {
                //next sentence
                sentence = this._getSentence(nextIdx);

                nextChar = sentence.current[0];
            }

            //The next character is a number
            if (this._isNumber(nextChar)) {

                //format is 'NUMBER'+'NUMBER'+...
                buffer = [char].concat(sentence.current);

                idx = sentence.currentIdx;

            } else {
                buffer.push(char);
            }

            sentence = {
                currentIdx: idx,
                current: buffer
            };

        }

        return sentence;
    }

    next() {
        var idx = this.currentIdx;

        //next sentence
        var nextSentence = this._getSentence(++idx);

        var current = nextSentence.current;

        this.currentIdx = nextSentence.currentIdx;

        return current.length === 0 ? undefined : current;
    }
}
