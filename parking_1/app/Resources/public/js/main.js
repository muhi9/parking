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



function headerClock(){
    $('.headerClock span').text(moment().format('HH:mm'));

}
setInterval(headerClock, (60*1000));
