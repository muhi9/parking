var formId =$(document).find('form').attr('name'); 

$(document).ready(function(){
	
	$('.hasChildEntity').each(function(){
		if($(this).val()>0){
			appendChild($(this));
		}
	})

	$('.hasChildEntity').on('change',function(){
		appendChild($(this));
	})

	function appendChild(parent){
		var parent_value = parent.val();
		var type = parent.attr('child_type')||false;
		var child = $('#'+formId+'_'+parent.attr('child'));	
		var childId = child.find(":selected").val()||0; 
		var selected ='';
		child.empty();
		child.prop('disabled',true);
		sendQeury(urls.ui_call, {'data':{'child':child.attr('id'),'type':type,'parent':parent_value}}).done(function(result){
			if(result.length>0){
				$.each(result,function(key,value){
					selected = value.id==childId?'selected="selected"':'';
					child.append('<option value="'+value.id+'" '+selected+'>'+value.name+'</option>');	
				})
			}
		child.prop('disabled',false);
		});
	}
});