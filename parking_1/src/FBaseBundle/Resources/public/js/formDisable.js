function formDisable(formId) {
    if (this===window) {
        return new formDisable(formId);
    } else {
        this.form = $(formId);
        this.init();
    }
}


formDisable.prototype = {
    form: null,
    init: function() {
        var that = this,
            elements = this.form[0].elements,
            speed;
            this.form.find(':input').attr('disabled','disabled');
            this.form.find('[type="submit"]').remove();
            if(this.form.find('.summernote').length>0){
                this.form.find('.summernote').summernote('disable');
            }
            //this.form.find('.dynamic button.add').remove();
        speed = 'fast';
    }
}