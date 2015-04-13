;(function($) {
    "use strict";
    var namespace = 'upvote';
    var dot_namespace = '.' + namespace;
    var upvote_css = 'upvote';
    var dot_upvote_css = '.' + upvote_css;
    var upvoted_css = 'upvote-on';
    var dot_upvoted_css = '.' + upvoted_css;
    var downvote_css = 'downvote';
    var dot_downvote_css = '.' + downvote_css;
    var downvoted_css = 'downvote-on';
    var dot_downvoted_css = '.' + downvoted_css;
    var count_css = 'count';
    var dot_count_css = '.' + count_css;
    var enabled_css = 'upvote-enabled';

    function init(dom, options) {
        return dom.each(function() {
            var jqdom = $(this);
            methods.destroy(jqdom);

            var count = parseInt(jqdom.find(dot_count_css).text(), 10) + 1;
            count = isNaN(count) ? 0 : count;
            var initial = {
                id: jqdom.attr('data-id'),
                count: count,
                upvoted: jqdom.find(dot_upvoted_css).size(),
                downvoted: jqdom.find(dot_downvoted_css).size(),
                callback: function() {}
            };

            var data = $.extend(initial, options);
            if (data.upvoted && data.downvoted) {
                data.downvoted = false;
            }

            jqdom.data(namespace, data);
            render(jqdom);
            setupUI(jqdom);
        });
    }

    function setupUI(jqdom) {
        jqdom.find(dot_upvote_css).addClass(enabled_css);
        jqdom.find(dot_downvote_css).addClass(enabled_css);
        jqdom.find(dot_upvote_css).on('click.' + namespace, function() {
            jqdom.upvote('upvote');
        });
        jqdom.find('.downvote').on('click.' + namespace, function() {
            jqdom.upvote('downvote');
        });
    }

    function _click_upvote(jqdom) {
        jqdom.find(dot_upvote_css).click();
    }

    function _click_downvote(jqdom) {
        jqdom.find(dot_downvote_css).click();
    }

    function render(jqdom) {
        var data = jqdom.data(namespace);
        jqdom.find(dot_count_css).text(data.count);
        if (data.upvoted) {
            jqdom.find(dot_upvote_css).addClass(upvoted_css);
            jqdom.find(dot_downvote_css).removeClass(downvoted_css);
        } else if (data.downvoted) {
            jqdom.find(dot_upvote_css).removeClass(upvoted_css);
            jqdom.find(dot_downvote_css).addClass(downvoted_css);
        } else {
            jqdom.find(dot_upvote_css).removeClass(upvoted_css);
            jqdom.find(dot_downvote_css).removeClass(downvoted_css);
        }
       
    }

    function callback(jqdom) {
        var data = jqdom.data(namespace);
        data.callback(data);
    }

    function upvote(jqdom) {
        var data = jqdom.data(namespace);
        if (data.upvoted) {
            data.upvoted = false;
            --data.count;
        } else {
            data.upvoted = true;
            ++data.count;
            if (data.downvoted) {
                data.downvoted = false;
                ++data.count;
            }
        }
        render(jqdom);
        callback(jqdom);
        return jqdom;
    }

    function downvote(jqdom) {
        var data = jqdom.data(namespace);
        if (data.downvoted) {
            data.downvoted = false;
            ++data.count;
        } else {
            data.downvoted = true;
            --data.count;
            if (data.upvoted) {
                data.upvoted = false;
                --data.count;
            }
        }
        render(jqdom);
        callback(jqdom);
        return jqdom;
    }

    
    function count(jqdom) {
        return jqdom.data(namespace).count;
    }

    function upvoted(jqdom) {
        return jqdom.data(namespace).upvoted;
    }

    function downvoted(jqdom) {
        return jqdom.data(namespace).downvoted;
    }


    var methods = {
        init: init,
        count: count,
        upvote: upvote,
        upvoted: upvoted,
        downvote: downvote,
        downvoted: downvoted,
        _click_upvote: _click_upvote,
        _click_downvote: _click_downvote,
        destroy: destroy
    };

    function destroy(jqdom) {
        return jqdom.each(function() {
            $(window).unbind(dot_namespace);
            $(this).removeClass(enabled_css);
            $(this).removeData(namespace);
        });
    }

    $.fn.upvote = function(method) {  
        var args;
        if (methods[method]) {
            args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this);
            return methods[method].apply(this, args);
        }
        if (typeof method === 'object' || ! method) {
            args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return methods.init.apply(this, args);
        }
        $.error('Method ' + method + ' does not exist on jQuery.upvote');
    };  
})(jQuery);
