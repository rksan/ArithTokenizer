export default class {
    //_ArithTokenType

    //operand
    static NUMBER = 'NUMBER'; //[0-9]
    static NUMBER_LOWER_LIMIT = '0';
    static NUMBER_UPPER_LIMIT = '9';
    static NUMBER_LOWER_LIMIT_CODE = (this.NUMBER_LOWER_LIMIT).codePointAt(0);
    static NUMBER_UPPER_LIMIT_CODE = (this.NUMBER_UPPER_LIMIT).codePointAt(0);

    //decimal
    static DOT = '.';

    //operators
    static MINUS = '-';
    static PLUS = '+';
    static STAR = '*';
    static SLASH = '/';

    //selectors
    static LEFT_SELECTOR = '(';
    static RIGHT_SELECTOR = ')';

    //other
    static ERROR = 'ERROR';
    static NONE = 'NONE';
    static SPACE = ' ';
};