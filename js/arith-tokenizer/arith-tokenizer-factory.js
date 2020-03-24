//import TokenType from './arith-token-type'
import Token from './arith-token.js'
import Tokenizer from './arith-tokenizer.js';

export default class {
    //class _ArithTokenizerFactory

    //@expample
    //var token = Factory.createToken(TokenType.NUMBER, ['1', '0', '0']);
    //@param type : string of TokenType
    //@param chars : array of char
    //@return { Token }
    static createToken(type, chars) {
        return new Token(type, chars);
    }

    //@expample
    //var tokenizer = Factory.createTokenizer('100+1000');
    //@param sequence : string
    //@return { Tokenizer }
    static createTokenizer(sequence) {
        return new Tokenizer(sequence, this);
    }
}