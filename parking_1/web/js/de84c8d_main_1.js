var base;
String.prototype.formatSPBR = function(arg) { return this.replace('( ','(').replace(' )',')'); }
$(document).ready(function(){
  base = $(this).attr('baseURI');
});


function listenForIframeReady(ifr, toUl) {
    var dwtoUrl = toUl;
    var dwiframe = ifr
  if (ifr.get(0).contentDocument.readyState === "interactive" || ifr.get(0).contentDocument.readyState === "complete") {
    iframeReady(ifr, dwtoUrl);
  } else {
    ifr.get(0).contentDocument.addEventListener('DOMContentLoaded', function (evt) { iframeReady(ifr, dwtoUrl, evt)});
    ifr.get(0).contentWindow.addEventListener('load', function (evt) { iframeReady(ifr, dwtoUrl, evt)});
    ifr.get(0).addEventListener('load', function (evt) { iframeReady(ifr, dwtoUrl, evt)});
  }
}

function iframeReady(dwiframe, dwtoUrl) {
  setTimeout(function() { location.href=dwtoUrl; }, 1100);
  dwiframe.get(0).contentDocument.removeEventListener('DOMContentLoaded', iframeReady);
  dwiframe.get(0).contentWindow.removeEventListener('load', iframeReady);
  dwiframe.get(0).removeEventListener('load', iframeReady);
}


cookie = {
    set: function(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    },

    get: function(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    },

    remove: function(key) {
        var keyValue = getCookie(key);
        setCookie(key, keyValue, '-1');
    }
}

_fullscreen = {
    set: function() {
        if (!this.available()) {
            return;
        }
        if ('requestFullscreen' in document.documentElement) {
            document.documentElement.requestFullscreen();
        } else if ('mozRequestFullScreen' in document.documentElement) {
            document.documentElement.mozRequestFullScreen();
        } else if ('webkitRequestFullScreen' in document.documentElement) {
            document.documentElement.webkitRequestFullScreen();
        } else if ('msRequestFullscreen' in document.documentElement) {
            document.documentElement.msRequestFullscreen();
        }
        if (cookie.get('_fullscreen') != 1)
            cookie.set('_fullscreen', 1, 1024);
    },

    reset: function() {
        if (!this.available()) {
            return;
        }
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if (cookie.get('_fullscreen') != 0)
            cookie.set('_fullscreen', 0, 1024);
    },

    status: function() {
        return this.available() && !!((document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null));
    },

    available: function() {
        return 'requestFullscreen' in document.documentElement || 'mozRequestFullScreen' in document.documentElement || 'webkitRequestFullScreen' in document.documentElement || 'msRequestFullscreen' in document.documentElement;
    },

    toggle: function() {
        this.available() && (this.status() ? this.reset() : this.set());
    },
    onload: function() {
        var fss = cookie.get('_fullscreen');
        if (fss == 1) {
            var that = this;
            setTimeout(function() { that.set();}, 100);
        }
    },
}


function duty_layout_form(selector, url) {
    if (this===window) {
        return new duty_layout_form(selector, url);
    } else {
        this.element = $(selector);
        this.url = url
        this.init();
    }
}
duty_layout_form.prototype = {
    element: null,
    url: '',
    sending: false,
    timeout: null,

    init: function() {
        var that = this;
        this.element.click(function() {
            that.toggleStatus();
        });
    },

    toggleStatus: function() {
        if (this.sending) {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        var that = this;
        this.element.css('filter', 'grayscale(90%)');
        this.timeout = setTimeout(function() {
            that.sending = true;
            sendQeury(that.url).done(function(data) {
                if (data.status===undefined) {
                    return;
                }
                if (data.status) {
                    that.element.find('.btn').attr('class', 'btn btn-danger').html('<i class="far fa-stop-circle"></i> Stop Duty Time');
                } else {
                    that.element.find('.btn').attr('class', 'btn btn-success').html('<i class="far fa-play-circle"></i> Start Duty Time');
                }
                that.element.attr('title', data.title);
                setTimeout(function() {
                    that.element.css('filter', '');
                    that.sending = false;
                }, 500);
            });
        }, 1000);
    }
}


function pageScrollTo(selector, options) {
    if (this===window) {
        return new pageScrollTo(selector, options);
    }
    this.element = $(selector);
    this.options = $.extend({}, this.options, options || {});
    this.init();
}

pageScrollTo.prototype = {
    element: null,
    options: {
        scrollTo: 'top',
        offset: 100,
        speed: 600,
        toggleClass: '',
    },

    init: function() {
        var that = this;
        $(window).bind('resize touchend touchcancel touchleave scroll', function(event) {
            that.onScroll();
        });
        this.element.bind('click', function() {
            that.scrollTo();
        });
        $(function() {
            that.element.hide();
            that.onScroll();
            that.element.show();
/////////////////////////////////////////////////////////// dynamic tables and tabs events!
            setInterval(function() {
                that.onScroll();
            }, 500);
        });
    },

    onScroll: function() {
        var position = window.pageYOffset,
            add = position > this.options.offset;
        if (this.options.scrollTo!='top') {
            add = position + Math.min($(document).height(), $(window).height()) < Math.max($(document).height(), $(window).height()) - this.options.offset;
        }
        $('body')[add ? 'addClass' : 'removeClass'](this.options.toggleClass);
    },

    scrollTo: function(to) {
        to = to || (this.options.scrollTo=='top' ? 0 : Math.max($(document).height(), $(window).height()));
        $("html, body").animate({scrollTop: to}, this.options.speed);
    }
}

function headerClock(){
    $('.headerClock span').text(moment().format('HH:mm'));

}
setInterval(headerClock, (60*1000));
