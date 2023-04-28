var params = {};
var parentData = {};
var formId = $(document).find('form').attr('name');

$(document).ready(function(){



var BaseUrl = siteUrl;
var last = '';
var i=0;
var NomTypes=[];
var BaseNom=[];
var target = false;

if(typeof nomtypeParams!='undefined'){
    params = JSON.parse(nomtypeParams);
}

if(typeof baseNomData!='undefined'){
    parentData = JSON.parse(baseNomData);
}
 //load nom types
 function nomtypes(element){
        $('.baseNomsParents').remove();
        if(element.val()!=''){
        that = element;
        sendQeury(urls.getNomType, {'data':element.val()}).done(function(result){
          if(result!=0){
                result['level'] = 0;
                result['criteries'] = {'type':$.trim(result['type']),'status':1};
                addElement(result,$(that));
          }
        });
      }
 }

 $(document).on('change', '.baseNomTypeParent', function(){
     nomtypes($(this));
  });

//check if nomtype is selected
if($('.baseNomTypeParent').length>0&&$('.baseNomTypeParent').val()!=''){
    nomtypes($('.baseNomTypeParent'));
}

if($('.baseNomsParents').length>0&&$('.baseNomsParents').val()!=''){
    selectBasenom($('.baseNomsParents'),true);
}

//select paretn
$(document).on('change', '.baseNomsParents select', function(){
  pass = true;
  selectBasenom($(this), pass,true);
})

$(document).on('click', '.addChild', function(e){
  e.preventDefault();
  selectBasenom($('[level="'+$(this).attr('pl')+'"]'),true);
})

$(document).on('click', '.addValue', function(e){
  e.preventDefault();
  addBaseNom($('[level="'+$(this).attr('pl')+'"]'),true);
})

$(document).on('click', '.callChildNomtype', function(e){
  e.preventDefault();
  selectBasenom($('[level="'+$(this).attr('levb')+'"]'),true,false);
})

function selectBasenom(element,pass,check){
    i++;
    type =0;
    value = [];
    target = false;
     if($(element).val()!=''){
        level = parseInt($(element).attr('level'));
        clearChild($(element));
        that = $(element);
        type =$(element).attr('child');

        if($('option:selected', element).attr('child')){
            type = $('option:selected', element).attr('child');
        }
        parentId = $(element).val();
        if(type=='0'&&params['target']&&$(element).attr('type')!=params['last']){
            target = params['target'];
            type = params['target'];
        }

        if($(element).val()=='new'){
            addBaseNom($(element));
        }else{

            if(type==0){
              return false;
            }
            if(!pass){
              return false;
            }
            c = {'data':type};
            if(check){
                c['check'] ={'parent_id':$(element).val(),'type':type};
            }

            sendQeury(urls.getNomType, c).done(function(result){
                if(result!=0){
                    result['criteries'] = {'parent':parseInt(parentId)};
                    result['parent'] =$(that).attr('level');
                    result['level'] = parseInt(level+1);
                    $(that).removeClass('float-left col-lg-7 col-md-7 col-sm-12');
                    $('[levb='+level+']').remove();
                    addElement(result,$(that));
                }else{
                    button = '<button class="ml-5 btn btn-success col-lg-3 col-md-3 col-sm-12 callChildNomtype" levb='+level+'>Add new child</button> ';
                    $(that).addClass('float-left check col-lg-7 col-md-7 col-sm-12');
                    $('[levb='+level+']').remove();
                    $(button).insertAfter(that);
                }
            });
        }
    }else{
     $(element).parent().append('<div id="url-error" class="error invalid-feedback"><ul><li>can not be empty.</li></ul></div>');
    }

}


function addElement(data,parent){
    level = parseInt(data['level']);
    childLevel = parseInt(level+1);
    elementClass ='form-control check';
    disabled = button ='';
    //add name
    name = '';
    fildName = data['type'].split('.');
    if(params['name']&&params['name']=='form'){
        name = 'name="'+formId+'[nomtypes]['+fildName[1]+']"';
    }
    if(!params['noname']){
        name = 'name="'+params['full_name']+'"';
    }

    if(Object.keys(parentData).length){
      disabled = 'disabled="disabled"';
    }


      sp ='<div id="element_'+level+'" class="baseNomsParents"><div class="form-group row validate"><label id="label_'+level+'" class="col-form-label col-lg-3 col-sm-12">'+data['label']+'</label><div class="col-lg-9 col-md-9 col-sm-12"><select '+disabled+' class="'+elementClass+'" required="required" id="'+formId+'_'+fildName[1]+'" level="'+level+'" type="'+data['type']+'" child="'+data['child']+'" name="'+formId+'[parent]" childLevel='+childLevel+' parent="'+data['parent']+'" im-insert="true" aria-describedby="type-error"></select>'+button+'</div>';

      $(sp).insertAfter(parent.closest('div.form-group'));

      dataId=null;
      if(parentData[data['type']]){
          dataId = parentData[data['type']]['id'];
      }
      getData(data,dataId,dataId);
    if(params['last']==data['type']){
      console.log('last', params, data);
      v='';
      if(parentData[data['type']]){
          v = parentData[data['type']]['value'];
      }
      /*
      sp ='<div id="element_'+level+'" class="baseNomsParents"><div class="form-group row validate"><label id="label_'+level+'" class="col-form-label col-lg-3 col-sm-12">'+data['label']+'</label><div class="col-lg-9 col-md-9 col-sm-12"><input class="'+elementClass+'" required="required" id="name" level="'+level+'" type="'+data['type']+'" child="'+data['child']+'" name="'+formId+'[name]" childLevel='+childLevel+' parent="'+data['parent']+'" value="'+v+'"  im-insert="true" aria-describedby="type-error" /></div>';
     $(sp).insertAfter(parent.closest('div.form-group'));
     */
     if(data['extraFields'].length>0){
       addExtra(data['extraFields'],level);
     }
    }else{
      /*
      sp ='<div id="element_'+level+'" class="baseNomsParents"><div class="form-group row validate"><label id="label_'+level+'" class="col-form-label col-lg-3 col-sm-12">'+data['label']+'</label><div class="col-lg-9 col-md-9 col-sm-12"><select '+disabled+' class="'+elementClass+'" required="required" id="'+formId+'_'+fildName[1]+'" level="'+level+'" type="'+data['type']+'" child="'+data['child']+'" name="'+formId+'[parent]" childLevel='+childLevel+' parent="'+data['parent']+'" im-insert="true" aria-describedby="type-error"></select>'+button+'</div>';

      $(sp).insertAfter(parent.closest('div.form-group'));

      dataId=null;
      if(parentData[data['type']]){
          dataId = parentData[data['type']]['id'];
      }
      getData(data,dataId,dataId);
      */
    }




}

function addExtra(data,level){
     if(parentData['ac.variant']){
          v = parentData['ac.variant']['extra'];
      }
    $.each(data, function(key,value) {
     extrdata = v[value]||'';
     if(value!='child'){
        sp ='<div  id ="ex'+key+'" class="baseNomNameExtra"><div class="form-group row validate"><label class="col-form-label col-lg-3 col-sm-12">Extra: '+value+'</label><div class="col-lg-9 col-md-9 col-sm-12"><input type="text" class="form-control name extraFields"  im-insert="true" aria-describedby="type-error" name="extraFields['+value+']" value="'+extrdata+'" /><div></div></div>';
        $(sp).insertAfter($('[level='+level+']').closest('div.form-group'));
     }

    })

}

function getData(value,id,addNew){
    value['criteries']['extraFields']='extra';
    criteries = {'criteries':value['criteries']};
    data = {'data':value};
    sendQeury(urls.basenom_load_child, data).done(function(result) {
      if('data' in result) {
        passData(result['data'],value,id,addNew);
      } else {
        $('[level="'+value['level']+'"]').append($("<option></option>"));
        $('[level="'+value['level']+'"]').append($("<option></option>").attr("selected",'selected').attr("value",'new').text('--New--')).change();
      }
    });


}

function passData(data,value,id,addNew){
    level = parseInt(value['level']);
    select = $('[level="'+level+'"]');
    select.empty();
    select.append($("<option></option>"));
    select.append($("<option></option>").attr("value",'new').text('--New--'));

    $.each(data, function(key,value) {
      selected = false;
      if(id==value.id){
        selected = 'selected';
      }
      if(value['extra']){
        select.append($("<option></option>").attr("value",value.id).attr("selected",selected).attr('child',value['extra']['child']).text(value['value']));
      }else{
        select.append($("<option></option>").attr("value",value.id).attr("selected",selected).text(value['value']));
      }

    })

    if(addNew){
        select.change();
    }
}

function addBaseNom(obj){
    label = $('#label_'+obj.attr('level')).text();
    level = obj.attr('level');
    var newElement = prompt("Please enter new "+label,'');
    newElement = $.trim(newElement);
    if(newElement != null&&newElement != ''){
        parentId =null;

        parent = obj.attr('parent')||false;

        if(parent){
            parentId =$('[level="'+parent+'"]').val();
        }

        objType = obj.attr('type');

        //insertData = {'data':{'table':'FBaseBundle:BaseNoms','value':{'parent_id':parentId,'type':objType,'name':newElement,'status':1}}};

        insertData = {'data':{'p':parentId,'t':objType,'val':newElement}};
        sendQeury(urls.basenom_add_new, insertData).done(function(data){
            if(data instanceof Object == true) {
              if (undefined !== data['success'] && true == data['success'] && parseInt(data['id'])>0) {
                if(data['error']){
                    alert(data['error']);
                    return false;
                }
                crs = {'id':obj.attr('id'),'level':level,'criteries':{'parent':insertData['data']['p'],'type':insertData['data']['t']},'child':obj.attr('child')};
                getData(crs,data,true);
              }
            }
        })

    }else{
        $(obj).children("option:selected").removeAttr('selected');
        $(obj).children("option:first").attr('selected','selected');
        return false;
    }
}


function clearChild(element){
    child = $(element).attr('childLevel')||false;

    while(child){
        child = child.replace('.','');
        hasChild = $('[level="'+child+'"]').attr('childLevel')||false;
        $('#element_'+child).remove();
        child = hasChild;
    }
    $('.last').remove();

 }

function submit(e,sc) {

    $('.error').remove();
    error = false;
    $('.check').each(function( i ) {
        v = $(this).val();
        if(v==''){
            $(this).parent().append('<div id="url-error" class="error invalid-feedback"><ul><li>can not be empty.</li></ul></div>');
            error = true;
        }
    });

    if(error){
        e.preventDefault();
        return false;
    }
    datas = $('#kform_id_'+formId).serialize();
    if(Object.keys(parentData).length){
      link = 'adm/manufacture_base_nom/edit/'+nomId;
    } else {
      link = 'adm/manufacture_base_nom/add';
    }

    sendQeury(link,datas)
    .done(function(result){
        if(result!=0){
            if(result['error']){
                alert(result['error']);
                e.preventDefault();
                return false;
            }

            if(sc){
                alert('success add new id:'+result);
                $('#name').val('');
            }else{
                if(!result['error']){
                    window.location.replace(siteUrl+"adm/manufacture_base_nom/");
                }
            }
          }
    })
    .fail(function(jqXHR){
        if(jqXHR.status==500 || jqXHR.status==0){
          alert('Error on server side: '+jqXHR.statusText);
          //console.log(jqXHR)
        } else {
          alert('Othe ajax error: '+jqXHR.statusText);
          //console.log(jqXHR)
        }
      return false;
    });
 e.preventDefault();
}

$(document).on('submit', '#kform_id_'+formId, function(e){
    submit(e,false);
})

//save and continue
$(document).on('click', '.saveContinue', function(e){
    submit(e,true);
})

});
