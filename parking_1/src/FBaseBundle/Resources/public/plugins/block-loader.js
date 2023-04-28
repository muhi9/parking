var BlockLoader = function() {
    return {
    start:function(target, opts) {
        var el = $(target);
        opts = $.extend(true, {
            opacity: 0.03,
            overlayColor: '#000000',
            type: 'v2',
            size: 'lg',
            state: 'brand',
            centerX: true,
            centerY: true,
            message: 'Please wait...',
            shadow: true,
            width: 'auto'
        }, opts);
        var html = '<div class="blockui"><span>' + opts.message + '</span><span><div class="k-spinner k-spinner--'+opts.version+' k-spinner--' + opts.state +  ' k-spinner--' + opts.size + '"></div></span></div>';
        var params = {
            message: html,
            centerY: opts.centerY,
            centerX: opts.centerX,
            css: {
                top: '30%',
                left: '50%',
                border: '0',
                padding: '0',
                backgroundColor: 'none',
                width: opts.width
            },
            overlayCSS: {
                backgroundColor: opts.overlayColor,
                opacity: opts.opacity,
                cursor: 'wait',
                zIndex: '10'
            },
        };
        if (target == 'body') {
            params.css.top = '50%';
            $.blockUI(params);
        } else {
            var el = $(target);
            el.block(params);
        }
    },

    stop:function(target) {
        if (target && target != 'body') {
            $(target).unblock();
        } else {
            $.unblockUI();
        }
    }
}
}