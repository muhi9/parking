function autocomplete(element){

    var base = siteUrl;//$(document).attr('baseURI');

    $('#'+element).keyup(function(e){
        var el = $(this);
        var symbmin = el.attr('automin')||2;
        $('.lists').remove();
        if(el.val().length>=symbmin){
            $.ajax({method:'post',url:urls.basenom_get_list, data:{'data':{'val':el.val(),'type':el.data('type')}},datatype:'json',
                success: function(result){
                    if(result!=0){
                        var list = '<div class="lists"><ul>';
                        $.each(result, function(id, val) {
                            list +='<li val="'+id+'">'+val+'</li>';
                        });
                        list += '</ul></div>';
                        el.after(list);
                        $('.lists').on('click','li',function(){
                            var s = $(this);
                            $('#'+el.attr('id')+'_hidden').val(s.attr('val'));
                            $(el).val(s.text());
                            $('.lists').remove();
                        })
                    }
                }
            })
        }
    })
}

$(function() {
  $('input.autocomplete').keyup(function(e){
    var url = base+'/autocomplete/';
    var tmpData ={'value':'','filter':''};
    $('input.autocomplete').keyup(function(e){
        var el = $(this);

        $('#'+el.attr('id')+'_hidden').val('');
        url = el.data('url')||url;
        //tmpData = JSON.parse(el.attr('data'));
        tmpData['filter'] =el.data('filter');

        $('.lists').remove();
        if(el.val().length>2){
          tmpData['value'] = el.val();
            $.ajax({
                method:'post',
                url:url,
                data:{'data':tmpData},
                datatype:'json',
                success: function(result){
                    if(result!=0){
                      var list = '<div class="lists"><ul>';
                        $.each(result, function(id, val) {
                           list +='<li val="'+id+'">'+val+'</li>';
                         });
                        list += '</ul></div>';
                        el.after(list);

                        $('.lists').on('click','li',function(){
                            var s = $(this);
                            $('#'+el.attr('id')+'_hidden').val(s.attr('val'));
                            $(el).val(s.text());
                           $('.lists').remove();
                        })
                  }
                }
            })
        }
    })
  })
})


