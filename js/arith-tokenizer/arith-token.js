import TokenType from './arith-token-type.js';

export default class {
    //_ArithToken

    //members
    #type = '';
    #chars = [];

    //@param type : String [property of _ArithTokenType.XXX]
    //@param chars : [char array]
    constructor(type, chars) {
        this.#type = type || ''; //string of token type
        this.#chars = chars || []; //[array of string]
    }

    //@return string
    type() {
        return this.#type;
    }

    //@return [char array]
    chars() {
        return this.#chars;
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
        return this.type() === TokenType.LEFT_SELECTOR;
    }

    //@return boolean
    isRightSelector() {
        return this.type() === TokenType.RIGHT_SELECTOR;
    }

    //@return boolean
    isPlus() {
        return this.type() === TokenType.PLUS;
    }

    //@return boolean
    isMinus() {
        return this.type() === TokenType.MINUS;
    }

    //@return boolean
    isStar() {
        return this.type() === TokenType.STAR;
    }

    //@return boolean
    isSlash() {
        return this.type() === TokenType.SLASH;
    }

    //@return boolean
    isNumber() {
        return this.type() === TokenType.NUMBER;
    }

    //@return boolean
    isError() {
        return this.type() === TokenType.ERROR;
    }

    //@return boolean
    isNone() {
        return this.type() === TokenType.NONE;
    }

    //@return boolean
    isSpace() {
        return this.type() === TokenType.SPACE;
    }

    //@return String
    toString() {
        return this.#_toString();
        //return this.chars().join('');
    }

    //---------------
    //private methods

    //@param separator : String
    //@return String
    #_toString = function _toString(separator){
        return this.chars().join(separator || '');
    }
};
