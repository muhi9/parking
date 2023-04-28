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

/*
 * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,
 * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,
 * make sure you copy the url from the website since the url may change between versions.
 * */
!function(e){e(["jquery"],function(e){return function(){function t(e,t,n){return g({type:O.error,iconClass:m().iconClasses.error,message:e,optionsOverride:n,title:t})}function n(t,n){return t||(t=m()),v=e("#"+t.containerId),v.length?v:(n&&(v=d(t)),v)}function o(e,t,n){return g({type:O.info,iconClass:m().iconClasses.info,message:e,optionsOverride:n,title:t})}function s(e){C=e}function i(e,t,n){return g({type:O.success,iconClass:m().iconClasses.success,message:e,optionsOverride:n,title:t})}function a(e,t,n){return g({type:O.warning,iconClass:m().iconClasses.warning,message:e,optionsOverride:n,title:t})}function r(e,t){var o=m();v||n(o),u(e,o,t)||l(o)}function c(t){var o=m();return v||n(o),t&&0===e(":focus",t).length?void h(t):void(v.children().length&&v.remove())}function l(t){for(var n=v.children(),o=n.length-1;o>=0;o--)u(e(n[o]),t)}function u(t,n,o){var s=!(!o||!o.force)&&o.force;return!(!t||!s&&0!==e(":focus",t).length)&&(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){h(t)}}),!0)}function d(t){return v=e("<div/>").attr("id",t.containerId).addClass(t.positionClass),v.appendTo(e(t.target)),v}function p(){return{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',closeClass:"toast-close-button",newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:"toast-progress",rtl:!1}}function f(e){C&&C(e)}function g(t){function o(e){return null==e&&(e=""),e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function s(){c(),u(),d(),p(),g(),C(),l(),i()}function i(){var e="";switch(t.iconClass){case"toast-success":case"toast-info":e="polite";break;default:e="assertive"}I.attr("aria-live",e)}function a(){E.closeOnHover&&I.hover(H,D),!E.onclick&&E.tapToDismiss&&I.click(b),E.closeButton&&j&&j.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&e.cancelBubble!==!0&&(e.cancelBubble=!0),E.onCloseClick&&E.onCloseClick(e),b(!0)}),E.onclick&&I.click(function(e){E.onclick(e),b()})}function r(){I.hide(),I[E.showMethod]({duration:E.showDuration,easing:E.showEasing,complete:E.onShown}),E.timeOut>0&&(k=setTimeout(b,E.timeOut),F.maxHideTime=parseFloat(E.timeOut),F.hideEta=(new Date).getTime()+F.maxHideTime,E.progressBar&&(F.intervalId=setInterval(x,10)))}function c(){t.iconClass&&I.addClass(E.toastClass).addClass(y)}function l(){E.newestOnTop?v.prepend(I):v.append(I)}function u(){if(t.title){var e=t.title;E.escapeHtml&&(e=o(t.title)),M.append(e).addClass(E.titleClass),I.append(M)}}function d(){if(t.message){var e=t.message;E.escapeHtml&&(e=o(t.message)),B.append(e).addClass(E.messageClass),I.append(B)}}function p(){E.closeButton&&(j.addClass(E.closeClass).attr("role","button"),I.prepend(j))}function g(){E.progressBar&&(q.addClass(E.progressClass),I.prepend(q))}function C(){E.rtl&&I.addClass("rtl")}function O(e,t){if(e.preventDuplicates){if(t.message===w)return!0;w=t.message}return!1}function b(t){var n=t&&E.closeMethod!==!1?E.closeMethod:E.hideMethod,o=t&&E.closeDuration!==!1?E.closeDuration:E.hideDuration,s=t&&E.closeEasing!==!1?E.closeEasing:E.hideEasing;if(!e(":focus",I).length||t)return clearTimeout(F.intervalId),I[n]({duration:o,easing:s,complete:function(){h(I),clearTimeout(k),E.onHidden&&"hidden"!==P.state&&E.onHidden(),P.state="hidden",P.endTime=new Date,f(P)}})}function D(){(E.timeOut>0||E.extendedTimeOut>0)&&(k=setTimeout(b,E.extendedTimeOut),F.maxHideTime=parseFloat(E.extendedTimeOut),F.hideEta=(new Date).getTime()+F.maxHideTime)}function H(){clearTimeout(k),F.hideEta=0,I.stop(!0,!0)[E.showMethod]({duration:E.showDuration,easing:E.showEasing})}function x(){var e=(F.hideEta-(new Date).getTime())/F.maxHideTime*100;q.width(e+"%")}var E=m(),y=t.iconClass||E.iconClass;if("undefined"!=typeof t.optionsOverride&&(E=e.extend(E,t.optionsOverride),y=t.optionsOverride.iconClass||y),!O(E,t)){T++,v=n(E,!0);var k=null,I=e("<div/>"),M=e("<div/>"),B=e("<div/>"),q=e("<div/>"),j=e(E.closeHtml),F={intervalId:null,hideEta:null,maxHideTime:null},P={toastId:T,state:"visible",startTime:new Date,options:E,map:t};return s(),r(),a(),f(P),E.debug&&console&&console.log(P),I}}function m(){return e.extend({},p(),b.options)}function h(e){v||(v=n()),e.is(":visible")||(e.remove(),e=null,0===v.children().length&&(v.remove(),w=void 0))}var v,C,w,T=0,O={error:"error",info:"info",success:"success",warning:"warning"},b={clear:r,remove:c,error:t,getContainer:n,info:o,options:{},subscribe:s,success:i,version:"2.1.3",warning:a};return b}()})}("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)});
//# sourceMappingURL=toastr.js.map

function sysMessage() {
    this.severity = [
        'error',
        'warning',
        'info',
        'success',
    ];
    this.displayType = [
        'modal',
        'toastr',
    ];
    this.defaultMsg = {
        title: 'Empty title',
        body: 'Empty body',
        footer: null, // to override footer set this to string.
        severity: 'error',
        displayType: 'modal',
    };
    this.msg = {};
    for (var k in this.defaultMsg) {
        this.msg[k] = this.defaultMsg[k];
    }
    this.defaultModalBody = this.defaultModalFooter = this.defaultModalTitle = '';
    this.modalOpen = false;
    this.modalQueue = [];
    this.initModal();
}


sysMessage.prototype.initModal = function() {
$('body').append('\
<div class="modal fade" id="msgModal" tabindex="-1" role="dialog" aria-labelledby="msgModal" aria-hidden="true">\
    <div class="modal-dialog modal-dialog-centered" role="document">\
        <div class="modal-content">\
            <div class="modal-header">\
                <h5 class="modal-title" id="msgModalTitle"></h5>\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                    <span aria-hidden="true">×</span>\
                </button>\
            </div>\
            <div class="modal-body" id="msgModalBody"></div>\
            <div class="modal-footer" id="msgModalFooter"></div>\
        </div>\
    </div>\
</div>\
');
    this.defaultModalTitle = 'Unset title';
    this.defaultModalBody = '';
    this.defaultModalFooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
}
sysMessage.prototype.initToastr = function() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "10000",
      "extendedTimeOut": "2000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
}

/*
    object should be inited. then u simply call:
    sysMessage.show({'title': 'Title of modal', 'body': 'msg here'})
*/
sysMessage.prototype.show = function(props) {
    if (props.displayType !== undefined && this.displayType.indexOf(props.displayType) > -1) {
        this.msg.displayType = props.displayType;
    }
    if (props.severity !== undefined && this.severity.indexOf(props.severity)>-1) {
        this.msg.severity = props.severity;
    }

    if (this.msg.displayType == 'modal') {
        // add
        this.showModal(props);
    }
    if (this.msg.displayType == 'toastr')
        this.showToastr(props);
}

sysMessage.prototype.showModal = function(msg) {
    var oThis = this;
    if (oThis.modalOpen == true) {
        oThis.modalQueue.push(msg);
        return;
    }
    if (oThis.modalQueue.length < 1)
        oThis.modalQueue.push(msg);
    if (oThis.modalOpen == false)
        oThis.showModalQueue();
}

sysMessage.prototype.showModalQueue = function() {
    var oThis = this;
    if (oThis.modalQueue.length<1) {
        //console.log('queue less than 1');
        return;
    }
    if (oThis.modalOpen) {
        //console.log('modal still open');
        return;
    }
    oThis.modalOpen = true;
    msg = oThis.modalQueue.shift();
    //console.log(msg, oThis.modalQueue);
    var msgButtonsStr = this.defaultModalFooter;
    if (msg.severity !== undefined)
        this.msg.severity = msg.severity;
    var icon = 'flaticon-';
    var alertType = 'alert-';
    if (this.msg.severity == 'error') {
        icon += 'close';
        alertType += 'danger';
    }
    if (this.msg.severity == 'warning') {
        icon += 'warning-sign';
        alertType += 'warning';
    }
    if (this.msg.severity == 'info') {
        icon += 'medical';
        alertType += 'info';
    }
    if (this.msg.severity == 'success') {
        icon += 'info';
        alertType += 'success';
    }
    if (msg.body != undefined)
        this.msg.body = msg.body;
    if (msg.title != undefined)
        this.msg.title = msg.title;

    $('#msgModalTitle').html(msg.title);
    $('#msgModalBody').html('\
    <div class="alert '+alertType+' fade show" role="alert">\
        <div class="alert-icon"><i class="'+icon+'"></i></div>\
        <div class="alert-text">'+this.msg.body+'</div>\
    </div>\
    ');
    //<!--<button type="button" class="btn btn-secondary">Save changes</button>-->
    if (msg.buttons !== undefined && Array.isArray(msg.buttons)) {
        for(var mbi=0; mbi<msg.buttons.length;mbi++) {
            msgButtonsStr = msg.buttons[mbi]+msgButtonsStr;
        }
    }
    $('#msgModalFooter').html(msgButtonsStr);
    $('#msgModal').modal({ show: false});
    $('#msgModal').modal('show');
    $('#msgModal').on('show.bs.modal', function (event) {

    });
    $('#msgModal').on('hide.bs.modal', function (event) {
        oThis.clearMsg();
        oThis.modalOpen = false;
        setTimeout(function() {
            oThis.showModalQueue();
        }, 750);
        if (oThis.modalQueue.length < 1 && 'onClose' in msg) {
            setTimeout(function() {
                msg.onClose();
            },750);
        }
    });
}

sysMessage.prototype.showToastr = function(msg) {
    if (msg.body != undefined)
        this.msg.body = msg.body;
    if (msg.severity !== undefined)
        this.msg.severity = msg.severity;

    if (this.msg.severity == 'error')
        toastr.error(this.msg.body);
    if (this.msg.severity == 'warning')
        toastr.warning(this.msg.body);
    if (this.msg.severity == 'info')
        toastr.info(this.msg.body);
    if (this.msg.severity == 'success')
        toastr.success(this.msg.body);
    this.clearMsg();
}

sysMessage.prototype.clearMsg = function() {
        $('#msgModalFooter').html(this.defaultModalFooter);
        $('#msgModalTitle').html(this.defaultModalTitle);
        $('#msgModalBody').html(this.defaultModalBody);
        this.msg.body = this.defaultMsg.body;
        this.msg.title = this.defaultMsg.title;
        this.msg.footer = this.defaultMsg.footer;
        this.msg.severity = this.defaultMsg.severity;
        this.msg.displayType = this.defaultMsg.displayType;
}
