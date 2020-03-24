
//@BNF
//<token> := (<number> | <operator> | <minus> | <selector>)*
//<positive> ::= ('0' | '1' | '2' ... | '9') | <positive>+
//<number> ::= <positive>
//           | (<none>|<minus>) <positive>
//           | <number> <dot> <positive>
//<selector> ::= '(' | ')'
//<operator> ::= '+' | '*' | '/'
//<minus> ::= '-'
//<dot> ::= '.'
//<none> := ''
//<space> := ' '
//
//@use
//<script>
//  var sequence = '12 + 345 / (-6789 + -10234) * (5 - 6)';
//  var tokenizer = new Tokenizer( sequence );
//  var tokens = tokenizer.tokenize();
//  window.console.log( tokens.toString() );
///*
// -> ['12', '+', '345', '/', '(', '-6789', '+', '-10234', ')', '*', '(', '5', '-', '6', ')']
//*/
//</script>

import TokenType from './arith-token-type.js';
import Factory from './arith-tokenizer-factory.js';

//--
//private

const symbol_sequence = Symbol('sequence');

export default class {
    //class _ArithTokenizer
    

    //@members
    //#sequence = ''; //string
    #currentIndex = -1; //number
    #tokens = []; //[array of token object]

    //@param sequence : string
    constructor(sequence) {
        this.#sequence = sequence || '';
        this[symbol_sequence] = sequence || '';
    }

    //--
    //like iterator
    //--

    //@return boolean
    get hasNext() {
        var nextIndex = this.#currentIndex + 1;
        return this.#inRagneOf(nextIndex);
    }

    //get next token.
    //@return token or undefined: next token.
    get next() {
        var token = this.#nextToken();
        return token;
    }

    //@param clone : boolean
    //@return [token array]: all tokens
    get tokenize(clone) {
        //Process all the rest
        while (this.hasNext() === true) {
            //get next
            this.next();
        }

        //For clones, concatenate the existing token array to the new array
        return clone === true ? [].concat(this.#tokens) : this.#tokens;
    }

    //----------------
    // private methods

    //get next token.
    //@return token or undefined: next token.
    _nextToken() {
        var idx = this.#currentIndex;

        //next sentence
        var nextSentence = this.#getSentence(++idx);

        //return value.
        var type = nextSentence.type;
        var chars = nextSentence.chars;
        var index = nextSentence.currentIndex;

        //create new token
        var token = this.#createToken(type, chars);

        if (token.isNone()) {
            //is end

            //clear
            token = undefined;
        } else {
            //Some character found

            //set members
            this.#tokens.push(token);
        }

        //set members
        this.#currentIndex = index;

        return token;
    };

    //@param type : String
    //@param chars : [char array]
    //@return _Token : new token
    _createToken(type, chars) {
        return Factory.createToken(type, chars);
    };

    //@param idx : index
    //@return boolean : Determine if index is within range.
    _inRangeOf(index) {
        return (index < this.#sequence.length);
    }

    //@param idx : index
    //@return char : charactor in sequence
    _getCharAt(index) {
        var char = undefined;

        //check index.
        if (this.#inRagneOf(index)) {
            //get char
            char = this.#sequence.charAt(index);
        }

        return char;
    }

    //@param char
    //@return string : token type or undefined
    _asNone(char) {
        return (char === undefined) ? TokenType.NONE : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asDot(char) {
        var type = TokenType.DOT;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asNumber(char) {
        var type = TokenType.NUMBER;

        //Returns Type if called without arguments
        if (arguments.length === 0) {
            return type;
        } else {
            //get char code
            var code = char.codePointAt(0);

            if (TokenType.NUMBER_LOWER_LIMIT_CODE <= code && code <= TokenType.NUMBER_UPPER_LIMIT_CODE) {
                return type;
            } else if (TokenType.DOT === char) {
                return type;
            }

            return undefined;
        }
    }

    //@param char
    //@return string : token type or undefined
    _asMinus(char) {
        var type = TokenType.MINUS;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asPlus(char) {
        var type = TokenType.PLUS;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asStar(char) {
        var type = TokenType.STAR;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asSlash(char) {
        var type = TokenType.SLASH;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asOperator(char) {
        var type = undefined;

        if (type = this.#asPlus(char)) {
            return type;
        } else if (type = this.#asStar(char)) {
            return type;
        } else if (type = this.#asSlash(char)) {
            return type;
        }

        return type;
    }

    //@param char
    //@return string : token type or undefined
    _asLeftSelector(char) {
        var type = TokenType.LEFT_SELECTOR;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asRightSelector(char) {
        var type = TokenType.RIGHT_SELECTOR;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asSelector(char) {
        var type = undefined;

        if (type = this.#asLeftSelector(char)) {
            return type;
        } else if (type = this.#asRightSelector(char)) {
            return type;
        }

        return type;
    }

    //@param char
    //@return string : token type or undefined
    _asSpace(char) {
        var type = TokenType.SPACE;
        return (type === char) ? type : undefined;
    }

    //@param char
    //@return string : token type or undefined
    _asError(char) {
        var type = TokenType.ERROR;
        return type;
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
        var sentence = this.#sentence(type, index, chars);
        var char = this.#getCharAt(index);

        //(Summary) Fixed an issue where calling 'Tokenizer.next ()' after reaching the end of the sequence would result in a runtime error.
        //(Details) In the state of "Tokenizer.hasNext () === false", the return value of "Tokenizer.next ()" must return "undefined". However, the argument of "Tokenizer._asNumber (char)" in the first "if" of the internal process "Tokenizer._getSentence ()" cannot be "undefined". Before that, it was changed to determine "char === undefined".
        if (type = this.#asNone(char)) { //need first.
            //as end

            //create sentence.
            sentence = this.#sentence(type, index, chars);

        } else if (type = this.#asNumber(char)) {
            //as number

            //---
            //If a number appears in a sequence,
            //you must search for the number in a subsequent sequence.
            //Consider two or more digits.
            //---
            let nextIdx = index;
            let nextChar = '';

            //check index
            if (this.#inRagneOf(++nextIdx)) {
                //next sentence
                sentence = this.#getSentence(nextIdx);

                nextChar = sentence.chars[0];
            }

            //The next character is a number
            if (this.#asNumber(nextChar)) {
                //two or more digits.

                //format is 'NUMBER'+'NUMBER'+...
                chars = [char].concat(sentence.chars);

                index = sentence.currentIndex;

            } else {
                //one digits.
                chars.push(char);
            }

            //create sentence.
            sentence = this.#sentence(type, index, chars);

        } else if (type = this.#asSpace(char)) {
            //skip space.

            //next sentence.
            sentence = this.#getSentence(++index);

        } else if (type = this.#asMinus(char)) {
            //as operator or number

            //---
            //When '-' appears in the sequence, 
            //if the sequence preceding it is not a number (if it is an operator),
            //it is necessary to search because the possibility that '-' is a negative sign cannot be discarded.
            //---
            let prevIdx = index;
            let prevChar = '';

            //check index.
            if (this.#inRagneOf(--prevIdx)) {
                //get prev char
                prevChar = this.#getCharAt(prevIdx);

                //skip space.
                while (this.#asSpace(prevChar)) {
                    //init
                    prevChar = '';

                    //check index.
                    if (this.#inRagneOf(--prevIdx)) {
                        //get prev char
                        prevChar = this.#getCharAt(prevIdx);
                    }
                }
            }

            //The previous character is not a number
            if (!this.#asNumber(prevChar)) {
                //as number.

                //next sentence
                sentence = this.#getSentence(++index);

                //format is '-'+'NUMBER'+'NUMBER'+...
                chars = [char].concat(sentence.chars);

                type = this.#asNumber();

                index = sentence.currentIndex;

                //create sentence.
                sentence = this.#sentence(type, index, chars);

            } else {
                //as operator.
                chars.push(char);

                //create sentence.
                sentence = this.#sentence(type, index, chars);
            }

        } else if (type = this.#asOperator(char)) {
            //as operator.

            chars.push(char);

            //create sentence.
            sentence = this.#sentence(type, index, chars);

        } else if (type = this.#asSelector(char)) {
            //as selector.

            chars.push(char);

            //create sentence.
            sentence = this.#sentence(type, index, chars);

        } else {
            //as error

            chars.push(char);

            type = this.#asError();

            //create sentence.
            sentence = this.#sentence(type, index, chars);
        }

        return sentence;
    }

};
