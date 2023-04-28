(function() {
	var extra  = $('#nom_form_extra');
  isChecked = extra.attr('checked')||null;
  if(isChecked!=null){
    addRow(1);
  }
  
  $(extra).change(function(){
    if(this.checked){
      addRow(1);  
    }else{
    $('.extraField').remove();    
    }
    
  })
  
	$(document).on('click','#addRow',function(event){
      event.preventDefault(); 
      addRow(0);
	})

  $(document).on('click','.removeRow',function(event){
      event.preventDefault(); 
      
      $(this).closest('div.extraField').remove();
  })


function addRow(data){
    html ='<div class="form-group row validate extraField exF"><label class="col-form-label col-lg-3 col-sm-12 required" for="nom_name">Name</label><div class="col-lg-9 col-md-9 col-sm-12"><input id="nom_name" name="noms[extraField][]" required="required"  class="form-control" im-insert="true" aria-describedby="name-error" type="text"><button class="removeRow bnt btn-danger">removeRow</button></div></div>';
    if(data>0){
      html +='<div class="form-group row validate extraField"><label class="col-form-label col-lg-3 col-sm-12 required"></label><div class="col-lg-9 col-md-9 col-sm-12"><button id="addRow" required="required"  class=" bnt btn-primary" im-insert="true" aria-describedby="name-error">addRow</button></div></div>';
      parent  = $('#nom_form_extra').closest('div.form-group');
    }else{
       parent  = $('.exF').last().closest('div.form-group');
    }
  
    $(html).insertAfter(parent);
}  

})(); 