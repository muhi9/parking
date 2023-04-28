(function() {

var last = '';
var extra = false;
var i=0;
var formId = $(document).find('form').attr('name');

//load nom types
if($('#'+formId+'_extData').length>0){
  extra = true;
  extraFields = JSON.parse($('#'+formId+'_extData').val());
  addExtra(extraFields);
 }

$(document).on('change', 'select.manufactureFields', function(){

    type =0;
    value = [];
    clearChild($(this));
    if($(this).val()!=''){
      that = $(this);
      type = $(this).attr('child')||false;
      parentId = $(this).val();

      if($(this).val()=='new'){
        addBaseNom($(this));
      }else{
        if(type){
          data['id'] = $(this).attr('child').replace('.','');
          data['criteries'] = {'type':type,'parent_id':parseInt($(this).val()),'status':1};
          data['parent'] = $(that).attr('id');
          getData(data);
        }
      }
    }
})

function submit(e,sc) {
    e.preventDefault();
     if(extra){
        insertExtraData = getExtra();
      }
    $('.error').remove();
      error = false;
      $('.check').each(function( i ) {
        v = $(this).val();
        if(v==''){
          $('<div id="url-error" class="error invalid-feedback"><ul><li>can not be empty.</li></ul></div>').insertAfter($(this));
          error = true;
        }
      });

      if(error){
        return false;
      }
      parentId = $('#'+formId+'_model').val();
      name = $('#name').val();
      type = 'ac.variant';
      insertData = {'data':{'table':'FBaseBundle:BaseNoms','value':{'parent_id':parentId,'type':type,'name':name,'status':1}}};
      datas = $('#kform_id_'+formId).serialize();

     sendQeury('adm/manufacture_base_nom/add',datas).done(function(result){
            if(result!=0){
              if(sc){
                alert('success add new id:'+result);
                $('#name').val('');
               }else{
                window.location.replace(siteUrl+"adm/manufacture_base_nom/");
              }
            }
        })

}

$(document).on('submit', '#kform_id_'+formId, function(e){
  submit(e,false);
})

//save and continue
$(document).on('click', '.saveContinue', function(e){
  submit(e,true);
})

function getData(value,id,addNew){

        data = {'data':value['criteries']};

        sendQeury('adm/base_nom/loadChild',data).done(function(result){
          if('data' in result){
            //console.log(result);
            return false;
            passData(result['data'],value,id,addNew);
          }else{
            $('#'+value['id']).append($("<option></option>"));
            $('#'+value['id']).append($("<option></option>").attr("selected",'selected').attr("value",'new').text('--New--')).change();
          }
        });


}

function passData(data,value,id,addNew){
    select = $('#'+value['id']);
    select.empty();
    select.append($("<option></option>"));
    select.append($("<option></option>").attr("value",'new').text('--New--'));

    $.each(data, function(key,value) {
      selected = false;
      if(id==key){
        selected = 'selected';
      }
      select.append($("<option></option>").attr("value",key).attr("selected",selected).text(value['value']));
    })

    if(addNew){
        select.change();
    }
}

function addBaseNom(obj){
    label = $('#label_'+obj.attr('id')).text();
    var newElement = prompt("Please enter new "+label,'');
    newElement = $.trim(newElement);
    if(newElement != null&&newElement != ''){
        parentId =null;
        parent = obj.attr('parent')||false;
        if(parent){
            parentId =$('#'+parent).val();
        }

        objType = obj.attr('type');

        //insertData = {'data':{'table':'FBaseBundle:BaseNoms','value':{'parent_id':parentId,'type':objType,'name':newElement,'status':1}}};
        insertData = {'data':{'p':parentId,'t':objType,'val':newElement}};


        sendQeury('/adm/base_nom/addNew',insertData).done(function(result){
            if(result!=0){
                crs = {'id':obj.attr('id'),'criteries':{'parent':insertData['data']['p'],'type':insertData['data']['t']},'child':$('#'+formId+'_'+parent).attr('child')};
                getData(crs,result,true);
            }
        })

    }else{
        $(obj).children("option:selected").removeAttr('selected');
        $(obj).children("option:first").attr('selected','selected');
      return false;
    }


}


function clearChild(element){
    child = $(element).attr('child')||false;

    while(child){
            child = child.replace('.','');
            hasChild = $('#'+child).attr('child')||false;
            $('#'+child).empty();
            $('#name').val('');
            child = hasChild;
    }

 }

function addExtra(data){
  console.log('add extra',data);return;
    $.each(data, function(key,value) {
     sp ='<div  id ="ex'+key+'" class="baseNomNameExtra"><div class="form-group row validate"><label class="col-form-label col-lg-3 col-sm-12">Extra: '+value+'</label><div class="col-lg-9 col-md-9 col-sm-12"><input type="text" class="form-control name extraFields"  im-insert="true" aria-describedby="type-error" name="extraFields['+value+']" value="" /><div></div></div>';
    $(sp).insertAfter($('#name').closest('div.form-group'));
    })

 }

})();
