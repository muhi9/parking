var BaseUrl = siteUrl;//$(document).attr('baseURI');
var last = '';
var i=0;
var NomTypes=[];
var BaseNom=[];
if (undefined === formName)
  var formName = 'fbasebundle_basenoms';
var nomLevel = 0;
if(typeof BaseNomLoad=='undefined')
  var BaseNomLoad=[];
if(typeof treeSettings=='undefined')
  var treeSettings = { 'showTree': true };

function initLoadTypes(el) {
  var el = $(el);
  if(el.val()!='') {
    var target = $('#kform_id_fbasebundle_basenoms .k-portlet__body');
    initLoadTypesByType(el.val(), target);
  }
}
function initLoadTypesByType(nomType, tragetEl, initFormName) {
  if(undefined !== initFormName && null!==initFormName)
    formName = initFormName;
  $(tragetEl).find('.baseNomsParents').remove();
  initTree(tragetEl);
      $.ajax({
        url: urls.loadNomTree,
        type: "POST", //or
        data: {'data':nomType},
        dataType: 'JSON', //or html or whatever you want
        success:function(result) {
          if(result['result']!=0) {
            pass = null;
            $.each(result['result'], function(key,value) {
            //console.error('each-nom-tree', key,value)

                  value['child'] = result['childs'][key];
                  if(value['length'] == 0
                     || ('lastElAsSelect' in treeSettings && treeSettings['lastElAsSelect'] == true)
                   ) {
                      nomLevel++;
                      NomTypes[nomLevel]=value;
                      var key = $.trim(key);
                      value['criteries'] = {'type':key,'status':1};
                      value['level'] = nomLevel;
                      value['key'] = $.trim(key);
                      //console.log('lastElAsSelect', tragetEl.find('div.nomtree'), nomLevel, key, value);
                      addSelEl(tragetEl.find('div.nomtree'), nomLevel, key, value['label'], value['child']);
                      last = result['last'];
                      loadData(value,null,null);
                  } else {
                    if('hideLastEl' in treeSettings && treeSettings['hideLastEl'] == true) {
                      console.log('hideLastEl active. not showing name');
                      return;
                    }
                    //console.log('ADD NAME!?', treeSettings['lastElAsSelect'], value, value['length']);
                    addName(value);
                    if('extra' in value && value['extra']!=null){
                      addExtra({ 'extra_fields': value['extra'], 'field': value});
                    }
                    pass = true;
                  }

            })
            if(result['extraFields']!=null&&pass==null){
              var ael=null;
              if( 'hideLastEl' in treeSettings && treeSettings['hideLastEl'] != true) {
                //ael=$('#fbasebundle_basenoms_name');
                ael=$('#'+formName+'_name');
                addExtra({ 'extra_fields': result['extraFields'], 'field': result}, ael);
              }
            }

            //$('#level_'+nomLevel).attr('name','fbasebundle_basenoms[parent]');
            $('#level_'+nomLevel).attr('name',formName+'[parent]');
          }
        }
      }).done(function() {
        //select parent - change vlues on each select of tree element.
        $('form[name="'+formName+'"] div.nomtree .baseNomsParents select').on('change', function(){
          selectBaseNomChild($(this));
        })
      })
}


function selectBaseNomChild(el) {
  var el = $(el);
  value = [];
  //console.log('rm basenomname',el, el.find('.baseNomName'));
  el.parent().find('.baseNomName').remove();
  console.log('selectBaseNomChild', el, last)
  //if(el.val()!='') {
    $('#element_'+el.attr('level')).addClass('ss');
    //value['criteries'] ={'parent':$.trim(el.val()),'type':$.trim(el.attr('child'))};
    value['criteries'] ={'parent':$.trim(el.val()),'type':$.trim(el.data('child')),'status':1};
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
      var key = $(el).data('key');
      //empty all child levels
      //console.log('levels', level, BaseNom);
      var treeContainer = el.parent().parent().parent().parent().parent().parent().find('div.nomtree');
      clearSelections(treeContainer, level);

      if (el.val()!='') {

        loadData(value,null,null);
        // this is the forced last element of the tree (by nom key). return and do not add more after it
        if ('lastTreeElement' in treeSettings && treeSettings['lastTreeElement'] == key) {
          console.error('ignore lastel ',el,key,value);
          return;
        }
        if(nomLevel==level) {
          if( 'hideLastEl' in treeSettings && treeSettings['hideLastEl'] == true) {
            return;
          }
          if ('lastElAsSelect' in treeSettings && treeSettings['lastElAsSelect'] == true) {
            if (value['last']<0 && value['last']+value['level']<1) return;
            //console.log('WTF111 ADD NAME!?', treeSettings['lastElAsSelect'],key,el, value);

            //addSelEl(value);
            // WARNING: nomLevel+1 is  set here, not ++nomLevel!!!! THIS causes the loop to forcly stop.
            // otherwise next level will be automatocally called.
            var targetEl = el.parent().parent().parent().parent().parent().parent().find('div.nomtree');
            if (targetEl.find('#level_'+(nomLevel+1)).length<1) {
              addSelEl(targetEl, nomLevel+1, key, last['label']);
            } else {
              //targetEl.find('#level_'+nomLevel+1).val(last['value']);
            }
            //loadData(value,null,null);
          } else {
            if (last) {
              console.log('add name last',last);
              addName(last);
            } else {
              console.error('Last not defined?!?',last);
            }
          }
        }
      }
    }
  //}
}


function clearSelections(targetEl, startLevel) {
  console.log('clearSelections', targetEl, startLevel);
  $(targetEl).find('[id^="level_"]').each(function() {
    var lev=$(this).attr('id').substring(6);
    lev=parseInt(lev);
    //console.log('level',lev);
    if(lev>startLevel) {
      //console.log('level',lev);
      $(this).empty();
    }
  });
}

function loadData(value,id,addNew) {
    if(value['parent']==null) {
      console.log('loadData',value,id,addNew);
        data = {'data': {'criteries':value['criteries']}};
         var BaseUrlB = siteUrl;//$(document).attr('baseURI');
        $.ajax({
            url: urls.basenom_load_child1,
            type: "POST",
            data: data,
            dataType: 'JSON',
            success:function(result) {
                var sel = $('#level_'+value['level']);

                //sel.append($("<option></option>").attr("value",'new').text('--New--')).change();
                if('data' in result){
                    BaseNom[value['level']] = result['data'];
                    select = $('#level_'+value['level']);
                    console.log('??set selected id', select,value['criteries']['type'],value,result);//, BaseNomLoad[value['criteries']['type']]['id'])
                    var nltype;
                    if (result['data'].length>0 && 'type' in result['data'][0]) {
                      nltype = result['data'][0]['type'];
                    }
                    //console.log('set selected', nltype, result);
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
        +'</div>'
      +'</div>';
       el.prepend(appendDiv);
  }
}

function addSelEl(appendTarget, level, key, label, child) {
    if (undefined !== child && null != child && child.length>0)
      child =  ' data-child="'+child+'" ';
    else
      child = '';
     sp ='<div id="element_'+level+'" class="baseNomsParents">'
         +'  <div class="form-group row validate">'
         +'    <label id="label_'+level+'" class="col-form-label col-lg-3 col-sm-12">'+label+'</label>'
         +'    <div class="col-lg-9 col-md-9 col-sm-12">'
         +'      <select class="form-control" name="'+formName+'[parent][]" id="level_'
                 +level+'" level='+level+' data-key="'+key+'"'+child+' im-insert="true" aria-describedby="type-error"></select>'
         +'    </div>'
         +'  </div>'
         +'</div>';
     $(appendTarget).append(sp);
 }

function addNameByType(nomKey, afterEl) {
  //console.error('addNameByType', nomKey, afterEl, $(afterEl).parent());
  $(afterEl).parent().find('.baseNomName').remove();
  if (nomKey != '') {
    $.ajax({
      url: urls.getNomType1,
      type: "POST", //or
      data: {'data':{'nameKey':nomKey}},
      dataType: 'JSON', //or html or whatever you want
      success:function(result) {
        //console.error('addnameres',result);
        if('data' in result) {
          pass = null;
          $.each(result['data'], function(key,value) {
          //console.error('each-nom-add', key,value)
            value['targetElAddType'] = 'insertAfter';
            value['targetEl'] = afterEl;
            addName(value);
            if(value['extraFields']!=null){
              var varr = {};
              for(var ex in value['extraFields']) {
                varr[value['extraFields'][ex]] = '';
              }
              //console.error('addExtraNameByType', varr);
              if (Object.keys(varr).length)
                addExtra({ 'extra_fields': varr, 'field': value});
            }
            pass = true;
          })
        }
      }
    })
  }
}

  function addName(data) {
    //console.error('addName',data)
    var loadValue = '';
    var targetEl = null;
    //var elName = 'fbasebundle_basenoms[name]';
    var elName = formName+'[name]';
    if (data['type'] in BaseNomLoad)
     loadValue = BaseNomLoad[data['type']]['value'];
    if ('value' in data)
     loadValue = data['value'];
    if ('targetEl' in data)
     targetEl = data['targetEl'];
    else
     targetEl = 'div.nameflds';
    if ('elName' in data)
     elName = data['elName'];

    $('.baseNomName').remove();
    $('div.extraflds').html('');
      var sp ='<div id='+$.now()+' class="baseNomsParents baseNomName">'
         +'<div class="form-group row validate">'
         +'<label class="col-form-label col-lg-3 col-sm-12">'+data['label']+' name</label>'
         +'<div class="col-lg-9 col-md-9 col-sm-12">'
         +'<input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" '
         +' name="'+elName+'" value="'+loadValue+'" />'
         +'</div></div>'
//         +'<div class="baseNomsParents baseNomName"><div>'
//         +' <input type="submit"  class="btn btn-sm  btn-brand float-right submit"   value="save" /></div></div>'
         ;
    //if ($('#kform_id_fbasebundle_basenoms .k-portlet__body div.nameflds').length<1) {
    if (!('targetElAddType' in data) && $('#kform_id_'+formName+' .k-portlet__body div.nameflds').length<1) {
      $('<div class="nameflds"></div>').insertAfter($('#accordeonBNomTree'));
    }
    if ('targetElAddType' in data) {
      if (data['targetElAddType'] == 'insertAfter' && $('div.nameflds').length<1)
        $('<div class="nameflds"></div>').insertAfter(targetEl);
        $('div.nameflds').append(sp);
    } else {
      $(targetEl).append(sp);
    }
  }

 function addExtra(data, afterEl) {
    //console.error('addExtra',afterEl, data);
    $('div.extraflds').html('');
    $.each(data['extra_fields'], function(key,value) {
      //console.error('extra k',key,'v',value, data);
      var loadValue ='';
      if (undefined !== value)
        loadValue = value;

      if (loadValue.length < 1
         && 'field' in data
         && 'type' in data['field']
         && undefined !== BaseNomLoad
           && undefined !== BaseNomLoad[data['field']['type']]
           && 'extra_fields' in BaseNomLoad[data['field']['type']]
           && undefined !== BaseNomLoad[data['field']['type']]['extra_fields']
           && key in BaseNomLoad[data['field']['type']]['extra_fields']
       ) {
        //console.log('set extra value',key, BaseNomLoad, data['field']['type']);
        loadValue = BaseNomLoad[data['field']['type']]['extra_fields'][key];
      }
      $('.baseNomNameExtra #ex_'+key).remove();
      if (key == 'nullable') return true; // system value - means fld can be nulled
      if (key.substr(0,4) == 'sys_') return true; // system key. do not show!
//console.log('addextra', key,loadValue);
      var sp = '<div  id ="ex_'+key+'" class="baseNomNameExtra">'
         +'  <div class="form-group row validate">'
         +'    <label class="col-form-label col-lg-3 col-sm-12">Extra: '+key+'</label>'
         +'    <div class="col-lg-9 col-md-9 col-sm-12">'
         +'      <input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" '
         +'        name="extraFields['+key+']" value="'+(loadValue==null?'':loadValue)+'" />'
         +'    <div></div></div>';
      //if ($('#kform_id_fbasebundle_basenoms .k-portlet__body div.extraflds').length<1) {
      if ($('#kform_id_'+formName+' .k-portlet__body div.extraflds').length<1) {
       if ($('div.nameflds').length>0) {
         if ($('#kform_id_'+formName+' .k-portlet__body div.extraflds').length<1) {
           //$('div.nameflds').append('<div class="extraflds"></div>');
           $('<div class="extraflds"></div>').insertAfter('div.nameflds');
         }
       } else {
         if ($('#kform_id_'+formName+' .k-portlet__body div.extraflds').length<1) {
           $('#kform_id_'+formName+' .k-portlet__body').prepend('<div class="extraflds"></div>');
         }
       }
      }
      var ael = $('#kform_id_'+formName+' .k-portlet__body div.extraflds');//'div.extraflds');
      if (afterEl) {
        ael = afterEl;
        $(sp).insertAfter(ael);
      } else {
        ael.append(sp);
      }
    })

 }

/*function addParent(data = null){
    $('.baseNomName').remove();
    //$('.baseNomsParents').not('#element_'+data['level']).remove();
    $('.baseNomsParents').not('.ss').remove();
    sp ='';
    if(data['level']<i){
        for(v=data['level'];v<=i;v++){
         sp ='<div id="parentName'+v+'" class="baseNomsParents"><div class="form-group row validate"><label class="col-form-label col-lg-3 col-sm-12">'+NomTypes[v]['label']+' name</label><div class="col-lg-9 col-md-9 col-sm-12"><input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" name="fbasebundle_basenoms[parent][]['+NomTypes[v]['criteries']['type']+']" value="" /><div></div></div>';
         $('#element_'+data['level']).append(sp);
        }
    }else{
         sp ='<div id="parentName'+data['level']+'" class="baseNomsParents"><div class="form-group row validate"><label class="col-form-label col-lg-3 col-sm-12">'+NomTypes[data['level']]['label']+' name</label><div class="col-lg-9 col-md-9 col-sm-12"><input type="text" class="form-control name"  im-insert="true" aria-describedby="type-error" name="fbasebundle_basenoms[parent][]['+NomTypes[data['level']]['criteries']['type']+']" value="" /><div></div></div>';
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
    console.log('loadSelectedData',select, data)
    $.each(data, function(key,val) {
      selected = false;
      if(id==val['id']){
        selected = 'selected';
      }
      select.append($("<option></option>").attr("value",val.id).attr("selected",selected).text(val['value']));
    })

    //if(addNew){
      setTimeout(function() {
        select.change();
      }, 30);
    //}
}

function addBaseNom(obj,label){
    level = parseInt(obj.attr('level'));
    var newElement = prompt("Please enter new "+label,'');
    /*
    var url='/adm/base_nom/add?parent=570&type=course.subtopic';
    $('.modal-container').load(url,function(result){
      $('#myModal').modal({show:true});
    });
        document.addEventListener("formValidationEnd", function(e) {
          if ('success' in e['returnData'] && 'id' in e['returnData']) {
            // addedd succefully.
            crs = {'criteries':{'parent':e['returnData']['parent'],'type':e['returnData']['type']},'level':level};
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
            parent = $('#level_'+parseInt(level-1)).val();
            objType = NomTypes[level]['criteries']['type'];
        }else{

            objType =  NomTypes[level]['criteries']['type'];
            parent = null;
        }
        //insertData = {'data':{'parent':parent,'type':objType,'val':newElement}};
        //sendQeury('adm/base_nom/add',insertData).done(function(data){});
        insertData = {'data':{'p':parent,'t':objType,'val':newElement}};
        sendQeury(urls.basenom_add_new,insertData).done(function(data){
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

/*
(function() {

 //load nom types
//  $(document).on('change', 'div.nomtree #fbasebundle_basenoms_type', function(){
//    initLoadTypes($(this));
//  });

//select paretn
//  $(document).on('change', 'div.nomtree .baseNomsParents select', function(){
//    selectBaseNomChild($(this));
//  })
 //submit handler
 /*
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

            url:BaseUrl+'adm/base_nom/add',
            type: "POST",
            data: data,
            dataType: 'JSON',
            success:function(result) {
                if(result=='1'){
                    window.location.replace(BaseUrl+"adm/base_nom/");
                }
                //BaseNom[value['level']] = result;
                //select = $('#level_'+value['level']);
                //loadSelectData(select, data, value, id, addNew);
            }
        });

 })

})();

*/