(function ($) {
    $(function _ready() {
        var $document = $(document),
            $body = $document.find('body'),
            $form = $body.find('form');

        $form.find('#go_tokenizer').on('click', function _debug_tokenaizer() {
            var sequence = $form.find('input[name=input_arith_sequence]').val();
            var $console = $body.find('#arith_console');

            var tokenizer = new _ArithTokenizer(sequence);

            $console.append($('<div />').append($('<span />').text('sequence:'), $('<span />').text(sequence)));

            var $table = $('<table />');
            var $tr = $('<tr />');
            var $th = $('<th />');
            var $td = $('<td />');

            //header
            $table.append(
                $tr.clone().append(
                    $th.clone().text('token.type'),
                    $th.clone().text('token.chars')
                )
            );

            while (tokenizer.hasNext() === true) {
                var token = tokenizer.next();

                $console.append($('<div />').text('"' + token.toString() + '"'));

                $table.append(
                    $tr.clone().append(
                        $td.clone().text(token.type()),
                        $td.clone().text(token.toString())
                    )
                );
            }

            $console.append( $talbe );
        });
    });
})(window.jQuery);