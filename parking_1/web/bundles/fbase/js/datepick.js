function datepick(selector){
    if (this===window) {
        return new datepick(selector);
    } else {
        this.selector = selector;
        this.element = $(this.selector);
        this.regex = this.element.attr('regex')||null;
        this.mask = this.element.attr('mask')||null;
        this.clearBtn = this.element.attr('datepickerClearBtn')||false;
        this.enableOnReadonly = this.element.attr('enableOnReadonly')||true;
        this.init();
        
    }
}

datepick.prototype = {
    selector: '',
    element: null,
    regex: null,
    mask: null,
    clearBtn: false,
    enableOnReadonly:true,
    init: function() {
        var that = this;
        $(this.selector).datepicker({
            rtl: KUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: that.clearBtn,
            todayHighlight: true,
            format: i18n.date_format,
            autoclose: true,
            enableOnReadonly: that.enableOnReadonly=='false'?false:true,
            templates: {
                leftArrow: "<i class='la la-angle-left'></i>",
                rightArrow: "<i class='la la-angle-right'></i>"
            },
        }).on('hide', function(evnt){
            if(that.regex){
                if(!new RegExp(that.regex).test($(this).val())) {
                  $(this).addClass('is-invalid').val('');
                }else{
                  $(this).removeClass('is-invalid');  
                }
            }
            if (!this.hasFocus) {
                if (!$(this).is(":focus")) {
                  this.hasFocus = true;
                  this.focus(); 
                }
            } else {
                this.hasFocus = false;
            }

        }).on('show', function () {
          if (this.hasFocus) {
            $(this).datepicker('hide'); 
          }
        })

        if(that.mask){
            that.applyMask();    
        }

        if(that.regex){
            that.applyRegex();    
        }
    },
    applyRegex: function() {
        this.element.inputmask({
            'regex': this.regex,
            isComplete: function(buffer, opts) {
                return new RegExp(opts.regex).test(buffer.join(''));
            }
        });
    },
    applyMask: function() {
        this.element.inputmask(this.mask,{});
    },
}