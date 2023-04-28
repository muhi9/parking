function inputMask(selector){
    if (this==window) {
        return new inputMask(selector);
    } else {
        this.selector = selector;
        this.element = $(this.selector);
        this.regex = this.element.attr('regex')||null;
        this.mask = this.element.attr('mask')||null;
        this.placeholder = this.element.attr('placeholder')||null;
        if(this.mask){
            this.applyMask();    
        }

        if(this.regex){
            this.applyRegex();    
        }
        
    }
}

inputMask.prototype = {
    selector: '',
    element: null,
    regex: null,
    mask: null,
    placeholder: '',
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