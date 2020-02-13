(function ($) {

    $(document).find('input[name=go_tokenizer]').on('click', function _debug_tokenaizer() {
        var sequence = $(document).find('input[name=input_arith_sequence]').val();
        var $console = $(document).find('#arith_console');

        var token = new _ArithTokenizer(sequence);

        $console.append($('<div />').txt(sequence));

        while (token.hasNext() === true) {
            var sentence = token.next();

            $console.append($('<div />').txt('"' + sentence.join('') + '"'));

        }
    });

})(window.jQuery);