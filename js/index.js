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

            var $table = $('<table />').css({
                'border':'1px solid gray',
                'border-collapse':' collapse'
            });
            var $tr = $('<tr />');
            var $th = $('<th />').css({
                'border-bottom':'1px solid gray'
            });
            var $td = $('<td />').css({
                'border-bottom':'1px solid gray'
            });

            //header
            $table.append(
                $tr.clone().append(
                    $th.clone().text('index'),
                    $th.clone().text('token.type'),
                    $th.clone().text('token.chars')
                )
            );

            var index = -1;

            while (tokenizer.hasNext() === true) {
                var token = tokenizer.next();

                $table.append(
                    $tr.clone().append(
                        $td.clone().text(++index),
                        $td.clone().text(token.type()),
                        $td.clone().text('"'+token.toString()+'"')
                    )
                );
            }

            $console.append($table);
        });
    });
})(window.jQuery);