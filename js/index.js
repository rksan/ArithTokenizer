(function ($) {
    var $document = $(document),
        $body = $document.find('body'),
        $form = $body.find('form');

    $form.find('#go_tokenizer').on('click', function _debug_tokenaizer() {
        var sequence = $form.find('input[name=input_arith_sequence]').val();
        var $console = $body.find('#arith_console');

        var token = new _ArithTokenizer(sequence);

        $console.append($('<div />').txt(sequence));

        while (token.hasNext() === true) {
            var sentence = token.next();

            $console.append($('<div />').txt('"' + sentence.join('') + '"'));

        }
    });

})(window.jQuery);