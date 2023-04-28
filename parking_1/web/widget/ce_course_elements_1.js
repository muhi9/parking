
function course_elements(selector, url) {
    if (this==window) {
        return new course_elements(selector, url);
    } else {
        this.selector = selector;
        this.element = $(this.selector+'_label');
        this.url = url;
        this.init();
    }
}

course_elements.prototype = {
    selector: '',
    element: null,
    row :'',
    init: function() {
        var that = this;
        this.element.bind('autocomplete_change', function(event, data) {
            that.row = $(this).closest('li').first();
            $(that.row).find('.uer').remove();
            if(data.exercise){
                var ul = $('.course_exercise_elements_tpl',that.row).first().data('prototype')||'';
                url = that.url.replace(/__exercise_id__/g, data.exercise);
                sendQeury(url).done(function(result){
                    if(result){
                        $.each(result,function(groupName,elemnts){
                            var tmp = '';
                                tmp +='<div class="row uer"><div class="col"><div class="form-group row  validate"><label class="k-checkbox input-info col-form-label col-lg-12 col-sm-12">'+groupName+'<input type="checkbox" class="groupCheckbox"  /><span></span></label><ul>';
                                $.each(elemnts,function(id,data){
                                    tmp += '<li>';
                                    tmp += ul.replace(/__key__/g, id);
                                    tmp = tmp.replace(/__element_name__/g, data.name);
                                    tmp = tmp.replace(/__value__/g, id);
                                    tmp +='</li>';
                                })
                                tmp +='</ul></div></div></div>';
                            $(that.row).append(tmp);
                            that.checkbox();
                        })
                    }
                });
            }
        });

    },
    checkbox: function(){
        $('.groupCheckbox, .elementCheckbox', this.row).on('click',function(){
            parent_row = $(this).closest('div.row');
            if($(this).is(':checked')){
                $('input:not([type="checkbox"])',$(parent_row)).prop('disabled',false);
                $('input[type="checkbox"]',$(parent_row)).prop('checked',true);
            }else{
                $('input:not([type="checkbox"])',$(parent_row)).prop('disabled',true);
                $('input[type="checkbox"]',$(parent_row)).prop('checked',false);
            }
        })
    }



}
