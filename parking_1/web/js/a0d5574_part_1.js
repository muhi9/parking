$(document).ready(function(){
	$('.showChild').on('click',function(){
        parentLi = $(this).closest('li');
        $('ul',parentLi).toggleClass("d-block");
    })

    $('.treeParent').on('change',function(){
        child  = $(this).data('target');
        parentLi = $(this).closest('li');
        if($(this).prop('checked')){
          //$(child).addClass('d-block').removeClass('d-none');
          //$('ul',parentLi).addClass('d-block').removeClass('d-none');
          $('input[type=checkbox]',parentLi).prop('checked',true);
        }else{
          //$(child).addClass('d-none').removeClass('d-block');
          //$('ul',parentLi).addClass('d-none').removeClass('d-block');
          $('input[type=checkbox]',parentLi).prop('checked',false);
        }  
    })
})