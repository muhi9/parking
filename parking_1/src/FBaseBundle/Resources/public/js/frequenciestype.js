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


 //load nom types
 function nomtypes(element){
      parentRow = $(element).closest('div.frequencies');
      $('.baseNomsParents',parentRow).remove();
      console.log(parentRow);
        that = element;
        sendQeury(urls.getNomType, {'data':element.data('child')}).done(function(result){
          if(result!=0){
                result['level'] = 0;
                result['criteries'] = {'type':$.trim(result['type']),'status':1};
                addElement(result,$(that));
          }
        });
 }

 $(document).on('change', '.frequencyType', function(){
     nomtypes($(this));
  });


//select paretn
$(document).on('change', '.baseNomsParents select', function(){
  selectFrequencies($(this));
})

function selectFrequencies(element){
    i++;
    type =0;
    value = [];
     if($(element).val()!=''){
        level = parseInt($(element).attr('level'));
        clearChild($(element));
        that = $(element);
        type =$(element).attr('child');

        if($('option:selected', element).attr('child')){
            type = $('option:selected', element).attr('child');
        }
        parentId = $(element).val();
        if($(element).val()=='new'){
            addBaseNom($(element));
        }else{
            if(type==0){
              return false;
            }
            sendQeury(urls.getNomType, {'data':type}).done(function(result){
                if(result!=0){
                    result['criteries'] = {'parent_id':parseInt(parentId),'status':1};
                    result['parent'] =$(that).attr('level');
                    result['level'] = parseInt(level+1);
                    addElement(result,$(that));
                }
            });
        }
    }else{
     $(element).parent().append('<div id="url-error" class="error invalid-feedback"><ul><li>can not be empty.</li></ul></div>');
    }

}


function addElement(data,parent){
    frequencyTypeChild =$(parent).closest('div.frequencies').data('row');
    parentRow = $(parent).closest('div.frequencies');
    level = parseInt(data['level']);
    childLevel = parseInt(level+1);
    elementClass ='form-control ';
    //add name
    fildName = data['type'].split('.');
    name = 'name="'+formId+'['+frequencyTypeChild+'][value]"';
    sp ='<div id="element_'+frequencyTypeChild+'_'+level+'" class="baseNomsParents float-left mr-2"><select class="'+elementClass+'" required="required" id="'+formId+'_'+fildName[1]+'" level="'+level+'" type="'+data['type']+'" child="'+data['child']+'" '+name+' childLevel='+childLevel+' parent="'+data['parent']+'" im-insert="true" aria-describedby="type-error"></select></div>';

    $(sp).insertAfter(parent.parent('div'));
    dataId=null;
    if(parentData[data['type']]){
        dataId = parentData[data['type']]['id'];
    }
    data['row'] = frequencyTypeChild;

    getData(data,dataId,dataId);

}



function getData(value,id,addNew){

    data = {'data':{'criteries':value['criteries']}};
    sendQeury('adm/base_nom/loadChild',data).done(function(result) {
      if('data' in result) {
       passData(result['data'],value,id,addNew);
      } else {
        $('[level="'+value['level']+'"]').append($("<option></option>"));
        $('[level="'+value['level']+'"]').append($("<option></option>").attr("selected",'selected').attr("value",'new').text('--New--')).change();
      }
    });
}

function passData(data,value,id,addNew){
    parent = $('.frequencies[data-row="'+value['row']+'"]');
    level = parseInt(value['level']);
    select = $('[level="'+level+'"]',parent);
    select.empty();
    select.append($("<option></option>"));
    select.append($("<option></option>").attr("value",'new').text('--New--'));

    $.each(data, function(key,value) {
      selected = false;
      if(id==value['id']){
        selected = 'selected';
      }
      select.append($("<option></option>").attr("value",value['id']).attr("selected",selected).text(value['value']));
    })

    if(addNew){
        select.change();
    }
}

function addBaseNom(obj){
    parentRow = $(obj).closest('div.frequencies').data('row');
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
        insertData = {'data':{'p':parentId,'t':objType,'val':newElement}};
        sendQeury('adm/base_nom/addNew',insertData).done(function(data){
            if(data instanceof Object == true) {
              if (undefined !== data['success'] && true == data['success'] && parseInt(data['id'])>0) {
                if(data['error']){
                    alert(data['error']);
                    return false;
                }
                crs = {'id':obj.attr('id'),'row':parentRow,'level':level,'criteries':{'parent':insertData['data']['p'],'type':insertData['data']['t']},'child':obj.attr('child')};
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
        frequencyTypeChild =$(element).closest('div.frequencies').data('row');

        while(child){
            child = child.replace('.','');
            hasChild = $('[level="'+child+'"]').attr('childLevel')||false;
            $('#element_'+frequencyTypeChild+'_'+child).remove();
            child = hasChild;
        }
     }

    $(document).on('click','.removeFrequency',function(e){
        e.preventDefault();
        $(this).parent('.frequencies').remove();
    });




    $('.addFrequency').on('click',function(e){
        frequenciesRow = parseInt(frequenciesRow+1);
        var tmp = '<div class="form-group row frequencies" data-row="'+frequenciesRow+'"><div class="col-lg-3 col-md-3 col-sm-12 float-left mr-2 "><select  name="'+formId+'['+frequenciesRow+'][typeId]"  data-child="ap.frequencyleve1"  class="form-control frequencyType"   >';
        tmp +='<option value="0">--Select--</option>';
        for(i=0; i<frequencies.length; i++){
            tmp +='<option value="'+frequencies[i].id+'">'+frequencies[i].name+'</option>';
        }
        tmp +='</select></div>';
        tmp +='<div class="col-lg-3 col-md-3 col-sm-12 float-left mr-2 "><input type="text" name="'+formId+'['+frequenciesRow+'][freq]" id="v_'+id_sufix+'" class="form-control  mask-regex frequency" placeholder = "123.33" regex="[0-9]{1,3}\\.[0-9]{1,10}"  /></div>';
        tmp += '<div class="col-lg-3 col-md-3 col-sm-12 float-left mr-2 "><select  name="'+formId+'['+frequenciesRow+'][freqType]"  class="form-control  frequencyMeasurements"   >';
        tmp +='<option value="0">--Select--</option>';
        for(i=0; i<measurement.length; i++){
            tmp +='<option value="'+measurement[i].id+'">'+measurement[i].name+'</option>';
        }
        tmp +='</select></div>';
        tmp +='<div class="removeFrequency"><i class="flaticon2-delete  d-block mt-3 ml-5"></i></div></div>';
        e.preventDefault();
        if($('.frequencies').length>0){
            last = $('.frequencies').last();
        }

        $(tmp).insertBefore($('.addFrequency'));
        $(document).on("focus", "#v_"+id_sufix, function() {
            var regex = $(this).attr('regex');
            $(this).inputmask({
                'regex':regex,
                isComplete: function(buffer, opts) {
                    return new RegExp(opts.regex).test(buffer.join(''));
                }
            });
        });
        frequenciesRow += 1;
    })

    $(document).on('submit','#kform_id_airportbundle_airportfrequencies',function(e){
       $(this).parent('form').attr('id');
       $('.error').remove();
        error = false;
        $('.frequencies').each(function(iRow,row){
            $(row).find('select').each(function(i,data){
                if($(this).val()==0||$(this).val()=='new'||$(this).val()==''){
                    error=true;
                    err = '<div id="url-error" class="error invalid-feedback"><ul><li>This field is required</li></ul></div>';
                    $(err).insertAfter($(this));
                }
            })
            $(row).find('input').each(function(i,data){
                if($(this).val()==''){
                    error=true;
                    err = '<div id="url-error" class="error invalid-feedback"><ul><li>This field is required</li></ul></div>';
                    $(err).insertAfter($(this));
                }
          })

        })
        if(error){
             e.preventDefault();
            return false;
        }else{
            return true;
        }
    });
});
