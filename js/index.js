import Factory from './arith-tokenizer/arith-tokenizer-factory.js';

(function ($) {
    $(function _ready() {
        var $document = $(document),
            $body = $document.find('body'),
            $form = $body.find('form');

        $form.find('#go_tokenizer').on('click', function _debug_tokenaizer() {
            var sequence = $form.find('input[name=input_arith_sequence]').val();
            var $console = $body.find('#arith_console');

            //var tokenizer = new _ArithTokenizer(sequence);
            var tokenizer = Factory.createTokenizer(sequence);

            $console.append($('<div />').append($('<span />').text('sequence:'), $('<span />').text(sequence)));

            var $table = $('<table />').css({
                'border-collapse': ' collapse'
            });
            var $tr = $('<tr />').css({
                'border-top': '1px solid gray',
                'border-bottom': '1px solid gray'
            });
            var $thead = $('<thead />');
            var $th = $('<th />');
            var $tbody = $('<tbody />');
            var $td = $('<td />');

            //header
            $table.append($thead);

            $thead.append(
                $tr.clone().append(
                    $th.clone().text('index'),
                    $th.clone().text('token.type'),
                    $th.clone().text('token.chars')
                )
            );

            //body
            $table.append($tbody);

            var index = -1;

            while (tokenizer.hasNext() === true) {
                var token = tokenizer.next();

                $tbody.append(
                    $tr.clone().append(
                        $td.clone().text(++index),
                        $td.clone().text(token.type()),
                        $td.clone().text('"' + token.toString() + '"')
                    )
                );
            }

            $tbody.sortable();

            $console.append($table);
        });
    });
})(window.jQuery);