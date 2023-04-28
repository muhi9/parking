var nomLevel = 0;
function selectBnomType(el) {
  var el = $(el);
  $('.baseNomsParents').remove();
  initTree($('#kform_id_fbasebundle_basenoms .k-portlet__body'));

  if(el.val()!='') {
      var BaseUrlA = siteUrl;//$(document).attr('baseURI');
      $.ajax({
        url:urls.loadNomTree,
        type: "POST", //or
        data: {'data':el.val()},
        dataType: 'JSON', //or html or whatever you want
        success:function(result) {
          if(result['result']!=0){
            pass = null;
            $.each(result['result'], function(key,value) {
            //console.log('each-nom-tree', key,value)

                  value['child'] = result['childs'][key];
                  if(value['length']==0){

                      nomLevel++;
                      NomTypes[nomLevel]=value;
                      value['criteries'] = {'type':$.trim(key),'status':1};
                      value['level'] = nomLevel;
                      createTree(value);
                      last = result['last'];
                      loadData(value,null,null);
                  }else{
                    if( 'doNotShowLastEl' in treeSettings && treeSettings['doNotShowLastEl'] == true)
                      return;
                    addName(value);
                    if(result['extraFields']!=null){
                      addExtra(result['extraFields']);
                    }
                    pass = true;
                  }

            })
            if(result['extraFields']!=null&&pass==null){
              var ael=null;
              if( 'doNotShowLastEl' in treeSettings && treeSettings['doNotShowLastEl'] != true) {
                ael=$('#fbasebundle_basenoms_name');
                addExtra(result['extraFields'],ael);
              }
            }

            $('#level_'+nomLevel).attr('name','fbasebundle_basenoms[parent_id]');
          }
        }
      })
  }
}


function selectBaseNomChild(el) {
  var el = $(el);
  value = [];
  $('.baseNomName').remove();
  if(el.val()!='') {
    $('#element_'+el.attr('level')).addClass('ss');
    value['criteries'] ={'parent':$.trim(el.val()),'type':$.trim(el.attr('child'))};
    level = parseInt(el.attr('level'));
    value['level'] =level+1;
    value['parent']=null;
    value['last']=parseInt($('.baseNomsParents').length)-value['level'];
    if(el.val()=='new'){
      addBaseNom(el,$('#label_'+level).text());
      // value['label'] = $('#label_'+level).text();
      // value['level'] =level;
      // addParent(value);
    } else {
      loadData(value,null,null);
      if(nomLevel==level) {
        if( 'doNotShowLastEl' in treeSettings && treeSettings['doNotShowLastEl'] == true)
          return;
        addName(last);
      }
    }
  }
}

function loadData(value,id,addNew){
    if(value['parent']==null) {
        data = {'data': {'criteries':value['criteries']}};
         var BaseUrlB = siteUrl;//$(document).attr('baseURI');
        $.ajax({

            url:urls.basenom_load_child1,
            type: "POST",
            data: data,
            dataType: 'JSON',
            success:function(result) {
                var sel = $('#level_'+value['level']);

                //sel.append($("<option></option>").attr("value",'new').text('--New--')).change();
                if('data' in result){
                    BaseNom[value['level']] = result['data'];
                    select = $('#level_'+value['level']);
                    //console.log('??set selected id', value['criteries']['type'],value,result);//, BaseNomLoad[value['criteries']['type']]['id'])
                    var nltype;
                    if (result['data'].length>0 && 'type' in result['data'][0]) {
                      nltype = result['data'][0]['type'];
                    }
                    if (nltype in BaseNomLoad) {
                      id = BaseNomLoad[nltype]['id'];
                      if (treeSettings['disableSelected'] == true)
                        select.attr('disabled', 'disabled');
                      //console.log('set selected id', result['data'],id, BaseNomLoad[nltype]['id'])
                    }
                    loadSelectData(select, result['data'], value, id, addNew);
                }
            }
        });
    }
}


function initTree(el) {
  var shown=treeSettings.showTree;
  if (el.find('div.nomtree').length<1) {
       var appendDiv=
       '<div class="form-group row"><div class=" col-lg-12 col-md-12 col-sm-12">'
        +'<div class="accordion accordion-light" id="accordeonBNomTree">'
        +'  <div class="card">'
        +'    <div class="card-header col-form-label col-lg-4 col-sm-12" id="nomTree">'
        +'      <div class="card-title'+(!shown?' collapsed':'')+' float-right" data-toggle="collapse" data-target="#collapseTree" aria-expanded="'+(shown?'true':'false')+'" aria-controls="collapseOne2">'
        +'      <i class="flaticon-edit-1"></i>'
                +'Nomenclature tree'
        +'      </div>'
        +'    </div>'
        +'    <div id="collapseTree" class="collapse'+(shown?' show':' ')+'" aria-labelledby="nomTree" data-parent="#accordeonBNomTree" style="">'
        +'      <div class="card-body">'
        +'        <div class="nomtree"></div>'
        +'      </div>'
        +'    </div>'
        +'  </div>'
        +'</div>'
        +'</div></div>';
       el.prepend(appendDiv);
  }
}

function createTree(data){
     sp ='<div id="element_'+data['level']+'" class="baseNomsParents">'
         +'  <div class="form-group row validate">'
         +'    <label id="label_'+data['level']+'" class="col-form-label col-lg-3 col-sm-12">'+data['label']+'</label>'
         +'    <div class="col-lg-9 col-md-9 col-sm-12">'
         +'      <select class="form-control" name="fbasebundle_basenoms[parent_id][]" id="level_'
                 +data['level']+'" level='+data['level']+'  im-insert="true" aria-describedby="type-error"></select>'
         +'    </div>'
         +'  </div>'
         +'</div>';
     $('#kform_id_fbasebundle_basenoms .k-portlet__body div.nomtree').append(sp);
 }

 function addName(data){
   console.log('addName',data)
   var loadValue = '';
   if (data['type'] in BaseNomLoad)
     loadValue = BaseNomLoad[data['type']]['value'];
    $('.baseNomName').remove();
     sp ='<div id='+$.now()+' class="baseNomsParents baseNomName">'
         +'<div class="form-group row validate">'
         +'<label class="col-form-label col-lg-3 col-sm-12">'+data['label']+' name</label>'
         +'<div class="col-lg-9 col-md-9 col-sm-12">'
         +'<input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" '
         +' name="fbasebundle_basenoms[name]" value="'+loadValue+'" />'
         +'</div></div>'
         +'<div class="baseNomsParents baseNomName"><div>'
         +' <input type="submit"  class="btn btn-sm  btn-brand float-right submit"   value="save" /></div></div>';
     if ($('#kform_id_fbasebundle_basenoms .k-portlet__body div.nameflds').length<1) {
       $('<div class="nameflds"></div>').insertAfter($('#accordeonBNomTree'));
     }
    $('div.nameflds').append(sp);
 }

 function addExtra(data, afterEl){
    console.log('addExtra',data,afterEl);
    // sp='';

    $.each(data, function(key,value) {

console.log('kv',key,'v',value);
      $('.baseNomNameExtra #ex_'+key).remove();
      if (key == 'nullable') return true; // system value - means fld can be nulled
      if (key.substr(0,4) == 'sys_') return true; // system key. do not show!
     sp = '<div  id ="ex_'+key+'" class="baseNomNameExtra">'
         +'  <div class="form-group row validate">'
         +'    <label class="col-form-label col-lg-3 col-sm-12">Extra: '+key+'</label>'
         +'    <div class="col-lg-9 col-md-9 col-sm-12">'
         +'      <input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" '
         +'        name="extraFields['+key+']" value="'+value+'" />'
         +'    <div></div></div>';
     if ($('#kform_id_fbasebundle_basenoms .k-portlet__body div.extraflds').length<1) {
       if ($('div.nameflds').length >0)
       $('div.nameflds').append('<div class="extraflds"></div>');
         else
       $('#kform_id_fbasebundle_basenoms .k-portlet__body').prepend('<div class="extraflds"></div>');
     }
    var ael = $('div.extraflds');
    if (null !== afterEl)
      ael = afterEl;
    //ael.append(sp);
    $(sp).insertAfter(ael);
    })

 }

/*function addParent(data = null){
    $('.baseNomName').remove();
    //$('.baseNomsParents').not('#element_'+data['level']).remove();
    $('.baseNomsParents').not('.ss').remove();
    sp ='';
    if(data['level']<i){
        for(v=data['level'];v<=i;v++){
         sp ='<div id="parentName'+v+'" class="baseNomsParents"><div class="form-group row validate"><label class="col-form-label col-lg-3 col-sm-12">'+NomTypes[v]['label']+' name</label><div class="col-lg-9 col-md-9 col-sm-12"><input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" name="fbasebundle_basenoms[parent_id][]['+NomTypes[v]['criteries']['type']+']" value="" /><div></div></div>';
         $('#element_'+data['level']).append(sp);
        }
    }else{
         sp ='<div id="parentName'+data['level']+'" class="baseNomsParents"><div class="form-group row validate"><label class="col-form-label col-lg-3 col-sm-12">'+NomTypes[data['level']]['label']+' name</label><div class="col-lg-9 col-md-9 col-sm-12"><input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" name="fbasebundle_basenoms[parent_id][]['+NomTypes[data['level']]['criteries']['type']+']" value="" /><div></div></div>';
         $('#element_'+data['level']).append(sp);
    }

    $('#level_'+data['level']).attr('disabled','disabled');
    addName(last);
 }
 */

function loadSelectData(select, data, value, id, addNew) {
    select.empty();
    select.append($("<option></option>"));
    if ('child' in value)
        select.attr('child',value['child']);
    if (!'addNew' in value || ('addNew' in value && value['addNew'] == true)) {
      //console.log('add addnew option',value)
      select.append($("<option></option>").attr("value",'new').text('--New--'));
    }
      console.log('loadSelectedData', data)
    $.each(data, function(key,val) {
      selected = false;
      if(id==val['id']){
        selected = 'selected';
      }
      select.append($("<option></option>").attr("data-key",val.bnomkey).attr("value",val.id).attr("selected",selected).text(val['value']));
    })

    //if(addNew){
      setTimeout(function() {
        select.change();
      }, 30);
    //}
}
/*
function sendQeury(url,data){
    return $.ajax({
        url:BaseUrl+url,
        type: "POST",
        data: data,
        dataType: 'JSON',

    });
}
*/

function addBaseNom(obj,label){
    level = parseInt(obj.attr('level'));
    var newElement = prompt("Please enter new "+label,'');
    /*
    var url='/adm/base_nom/add?parent_id=570&type=course.subtopic';
    $('.modal-container').load(url,function(result){
      $('#myModal').modal({show:true});
    });
        document.addEventListener("formValidationEnd", function(e) {
          if ('success' in e['returnData'] && 'id' in e['returnData']) {
            // addedd succefully.
            crs = {'criteries':{'parent':e['returnData']['parent_id'],'type':e['returnData']['type']},'level':level};
            loadData(crs,data,true);
            //alert('added');
            //console.log(ed['returnData']);
          }
          console.log('formvalidation finised OK',e);
        }, false);
      */

    newElement = $.trim(newElement);
    if (newElement != null&&newElement != '') {
        if(level>1){
            parentId = $('#level_'+parseInt(level-1)).val();
            objType = NomTypes[level]['criteries']['type'];
        }else{

            objType =  NomTypes[level]['criteries']['type'];
            parentId = null;
        }
        //insertData = {'data':{'parent_id':parentId,'type':objType,'val':newElement}};
        //sendQeury('adm/base_nom/add',insertData).done(function(data){});
        insertData = {'data':{'p':parentId,'t':objType,'val':newElement}};
        sendQeury(urls.basenom_add_new, insertData).done(function(data){
            if(data instanceof Object == true) {
              if (undefined !== data['success'] && true == data['success'] && parseInt(data['id'])>0) {
//                $('.baseNomName').remove();
            //    $('.baseNomsParents').not('.ss').remove();
                if(level==1){
                  insertData['data']['value']['type'] =null;
                }
                crs = {'criteries':{'parent':insertData['data']['p'],'type':insertData['data']['t']},'level':level};
                loadData(crs,data,true);
              } else {
                obj.val(0);
              }
            } else {
              obj.val(0);
            }
        })
        //.fail(function() {
        //  obj.val(0);
        //})
    }
}


var BaseUrl = siteUrl;//$(document).attr('baseURI');
var last = '';
var i=0;
var NomTypes=[];
var BaseNom=[];

if(typeof BaseNomLoad=='undefined')
  var BaseNomLoad=[];
if(typeof treeSettings=='undefined')
  var treeSettings = { 'showTree': true };
(function() {

 //load nom types
  $(document).on('change', '#fbasebundle_basenoms_type', function(){
    //selectBnomType($(this));
  });

//select paretn
  $(document).on('change', '.baseNomsParents select', function(){
    selectBaseNomChild($(this));
  })
 //submit handler
$(document).on('submit', '#kform_id_fbasebundle_basenoms', function(e){
      e.preventDefault();
    $('.error').remove();
      error = false;
      $('.name').each(function( i ) {
        v = $(this).val();
        if(v==''){
          //$(this).append('<div id="url-error" class="error invalid-feedback"><ul><li>Name can not be empty.</li></ul></div>');
          $('<div id="url-error" class="error invalid-feedback"><ul><li>Name can not be empty.</li></ul></div>').insertAfter($(this));
          error = true;
        }
      });

      if(error){
        return false;
      }


        data = $('#kform_id_fbasebundle_basenoms').serialize();
        $.ajax({

            url: urls.basenom_add,
            type: "POST",
            data: data,
            dataType: 'JSON',
            success:function(result) {
                if(result=='1'){
                    window.location = urls.basenom_list;
                }
                //BaseNom[value['level']] = result;
                //select = $('#level_'+value['level']);
                //loadSelectData(select, data, value, id, addNew);
            }
        });

 })


})();
