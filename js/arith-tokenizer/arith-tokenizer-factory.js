//import TokenType from './arith-token-type'
import Token from './arith-token'
import Tokenizer from './arith-tokenizer';

export default class {
    //class _ArithTokenizerFactory

    //@param type : string of TokenType
    //@param chars : array of char
    //@return { Token }
    static createToken(type, chars) {
        return new Token(type, chars);
    }

    //@param sequence : string
    //@return { Tokenizer }
    static createTokenizer(sequence) {
        return new Tokenizer(sequence, this);
    }
}