(function ($) {

    function runTokenizer(sequence) {
        var token = new _ArithTokenizer(sequence);

        window.console.log('"' + sequence + '"');

        while (token.hasNext() === true) {
            var sentence = token.next();

            window.console.log('"' + sentence.join('') + '"');

        }
    }

    function debug_tokenaizer() {
        var value = $(document).find('input[name=input_arith_sequence]').val();
        //var value = '1+2/(3+4)*(5-6)';
        runTokenizer(value);
    }

})(window.jQuery);