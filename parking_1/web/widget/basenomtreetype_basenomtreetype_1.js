

function BaseNomTreeType(opts) {
  this.params = {};

  if (opts['element'] === undefined) {
    throw "Target Element required!";
    return;
  } else {
    this.targetEl = $(opts['element']);
    this.targetElId = this.targetEl.attr('id');
    this.containerEl = null;
    this.containerElId = null;
  }
  if (opts['form'] === undefined) {
    this.targetForm = $(this.targetEl).closest('form')[0];
  }
  if (opts['formId'] === undefined) {
    throw "Can't continue without formId";
    return;
  } else {
    this.formId = opts['formId'];
  }
  if (opts['formName'] === undefined) {
    throw "Can't continue without formName";
    return;
  } else {
    this.formName = opts['formName'];
  }

  if (opts['parentData'] === undefined) {
    this.parentData = {};
  } else {
    this.parentData = opts['parentData'];
  }
  if(opts['NomTypes'] === undefined) {
    this.NomTypes = [];
  } else {
    this.NomTypes = opts['NomTypes'];
  }
  if (opts['BaseNom']===undefined) {
    this.BaseNom = [];
  } else {
    this.BaseNom = opts['BaseNom'];
  }
  if(opts['BaseNomLoad'] === undefined) {
    this.BaseNomLoad = [];
  } else {
    this.BaseNomLoad = opts['BaseNomLoad'];
  }

  if(opts['params'] === undefined) {
    throw "params is needed for init!";
    return;
  }
  this.params = opts['params'];// JSON.parse(nomtypeParams);
  //console.log('params',this.params)

  if(opts['parentsData'] !== undefined) {
    this.parentData = opts['parentsData'];// JSON.parse(baseNomData);
    //this.formId = this.parentData.formId;
    //console.log('parentdata',this.parentData)
  }


  //var formId = $(document).find('form').attr('name');
  this.BaseUrl = siteUrl;
  this.last = '';

  this.target = false;
  this.baseNomCount = 0;
  this.level = 0;

}


//$(document).ready(function(){
BaseNomTreeType.prototype.init = function() {
    // check if the form id is available. if not try kform_id_{{formid}}  - this is because our override for theme
    //console.log('test form1', '#'+this.formId, $('#'+this.formId));
    if ($('#'+this.formId).length<1) {
        //console.log('test form2', '#kform_id_'+this.formId, $('#kform_id_'+this.formId));
      if($('#kform_id_'+this.formId).length==1) {
        this.formId = 'kform_id_'+this.formId;
      } else {
        throw "FATAL ERROR. Form "+this.formId+" NOT FOUND!!!";
        return;
      }
    }
    var oThis = this;
    //console.log('init', this.targetElId)
    this.createHolder();
    $('#'+this.formId).find('#'+this.targetElId+'.baseNomTypeParent').bind('change', function(){
         this.initFromRootElement($(this));
    });

    //check if nomtype is selected
    var el = $('#'+this.formId).find('#'+this.targetElId+'');
    //console.log('initFromRootElement', '$(\'#'+this.formId+'\').find(\'#'+this.targetElId+'.baseNomTypeParent\')');
    if(el.length>0 && el.val()!=''){
        this.initFromRootElement(el);
    }

    if(this.containerEl.find('.baseNomsParents').length>0 && this.containerEl.find('.baseNomsParents').val()!=''){
        oThis.selectBasenom(this.containerEl.find('.baseNomsParents'),true);
    }

    //select paretn
    //console.log('bind change', this.containerEl, this.containerEl.find('.baseNomsParents select'));
    //this.containerEl.find('.baseNomsParents select').on('change', function() {
    //$(document).on('change', this.containerEl.find('.baseNomsParents select'), function() {
    $(document).on('change', '#'+this.containerElId+' select', function() {
      pass = true;
      //if(params['addChildButton']){
       // pass = false;
      //}
      console.log('changed .basenomParents.',$(this));
      //oThis.selectBasenom(oThis.containerEl.find('.baseNomsParents select'), pass,true);
      oThis.selectBasenom($(this), pass,true);
    })

    this.containerEl.find('.baseNomsParents .addChild').bind('click', function(e){
      e.preventDefault();
      oThis.selectBasenom($('[level="'+$(this).attr('pl')+'"]'),true);
    })

    this.containerEl.find('.baseNomsParents .addValue').bind('click', function(e){
      e.preventDefault();
      oThis.addBaseNom($('[level="'+$(this).attr('pl')+'"]'),true);
    })

    this.containerEl.find('.baseNomsParents .callChildNomtype').bind('click', function(e){
      e.preventDefault();
      oThis.selectBasenom($('[level="'+$(this).attr('levb')+'"]'),true,false);
    })

/*
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
          //при опция за пращане с айакс
         /*
          parent = $('[level='+$('#name').attr('parent')+']').val();
          name = $('#name').val();
          type = params['last_element'];
          insertData = {'data':{'table':'FBaseBundle:BaseNoms','value':{'parent':parent,'type':type,'name':name,'status':1}}};
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
        * /
    }

    $(document).on('submit', '#kform_id_'+formId, function(e){
      submit(e,false);
    })
    //save and continue
    $(document).on('click', '.saveContinue', function(e){
      submit(e,true);
    })

*/
};

BaseNomTreeType.prototype.createHolder = function() {

    this.containerElId = this.targetElId+'_container';
    if ($('div#'+this.containerElId+'.nomtree').length<1) {
       var shown=true;
       if ('tree' in this.params && 'show' in this.params['tree'])
         shown =this.params.tree.show;
       var appendDiv=
       '<div class="form-group row"><div class=" col-lg-12 col-md-12 col-sm-12">'
        +'<div class="accordion accordion-light" id="'+this.targetElId+'_accordeonBNomTree">'
        +'  <div class="card">'
        +'    <div class="card-header col-form-label col-lg-3 col-sm-10" id="'+this.targetElId+'_nomTree">'
        +'      <div class="card-title'+(!shown?' collapsed':'')+' float-right" data-toggle="collapse" data-target="#'+this.targetElId+'_collapseTree" aria-expanded="'+(shown?'true':'false')+'" aria-controls="collapseOne2">'
        +'      <i class="flaticon-edit-1"></i>'
                //+'Nomenclature tree'
                +this.params['tree']['expandTopLabel']
        +'      </div>'
        +'    </div>'
        +'    <div id="'+this.targetElId+'_collapseTree" class="collapse'+(shown?' show':' ')+'" aria-labelledby="'+this.targetElId+'_nomTree" data-parent="#'+this.targetElId+'_accordeonBNomTree" style="">'
        +'      <div class="card-body">'
        +'        <div class="nomtree" id="'+this.containerElId+'"></div>'
        +'      </div>'
        +'    </div>'
        +'  </div>'
        +'</div>'
        +'</div></div>';
      var widgetEl = $('#'+this.formId).find('input[name="'+this.params.targetElName+'"]').parent();
      $(appendDiv).insertAfter(widgetEl.closest('div.form-group'));
    }
    //console.log('createWidgetHolder',widgetEl, appendDiv,widgetEl.closest('div.form-group'));
    this.containerEl = $('#'+this.formId).find('#'+this.containerElId);
    //console.log('create holder',this.containerEl);
}


 //load nom types
BaseNomTreeType.prototype.initFromRootElement = function (element){
     var depth = 0;
     var oldEl = element;
     element = element.parent().find('select');
     this.containerEl.find('.baseNomsParents').remove();
     this.isInit = true;
    //console.log('nomtypes');
     if(element.val()!=''){
        var that = element;
        var oThis = this;
        //console.log('query element',element);
        //var c = {'data':{'parentNameKey1': type, 'parent': element.val()}};
        var c = {'data': {'parentNameKey1':element.attr('type')},'check':{'type': element.attr('type'), 'parent': element.val()}};
        if (element.val().length>0)
          c.data.parentId=element.val();
        //console.log('parents',this.NomTypes)
        if (this.params['dataType'] == 'nomTypeKey') {
          // special nomtypekey mode - set root as passed but get child types for adding them
          var c = {'data':{ 'nameKey': this.params['child']}};//, 'id': this.params['childId'] }};
          //c['check']['type'] = this.params['child'];
          //c['check']['parent'] = this.params['childId'];
          //oldEl.remove(); // remove hidden input so it's not submited twice
        }
        sendQeury(urls.getNomType1,c)
        .done(function(result) {
          if('data' in result && result['data'].length > 0) {
              oThis.level=0;
              for(var el in result['data']) {
                var rel = result['data'][el];
                if (!rel['type'] in oThis.NomTypes)
                  oThis.NomTypes[rel['type']] = rel;
                rel['level'] = oThis.level;
                rel['criteries'] = {'type':$.trim(rel['type']),'status':1,'parent':element.val()};
                //console.log('addel init', rel, element);
                oThis.addElement(rel,$(that), depth++);
              }
          }
        });
    }
 }

BaseNomTreeType.prototype.selectBasenom = function(element,pass,check) {
    //console.log('selecteBasenom', element, pass, check);
    this.baseNomCount++;
    var type =0;
    if($(element).val()!='') {
        this.level = parseInt($(element).attr('level'));
        this.clearChild($(element));
        type = $(element).attr('type');//$(element).attr('child');

        if(this.containerEl.find('option:selected', element).attr('child')){
            type = this.containerEl.find('option:selected', element).attr('child');
        }
        parent = $(element).val();

        if(type=='0'&&this.params['target']&&!this.target){
            this.target = this.params['target'];
            type = this.params['target'];
            //target =false;
        }

        if($(element).val()=='new'){
            this.addBaseNom($(element));
        }else{
            if(type==0){
              return false;
            }
            if(!pass){
              return false;
            }
            var c = {'data':{'parentNameKey1': type}};
            if(check){
            }
                c['check'] ={'parent':$(element).val(),'type':type};

            this.queryAddElement($(element), c,0);
        }
    }else{
     //$(element).parent().append('<div id="url-error" class="error invalid-feedback"><ul><li>can not be empty.</li></ul></div>');
    }

}


BaseNomTreeType.prototype.queryAddElement = function(element, criteries, depth, depthParentPid) {
  var oThis = this;
var elPid=null;
            if (depth > 0 && undefined !== depthParentPid && NaN != parseInt(depthParentPid))
              elPid = parseInt(depthParentPid);
            else {
              //console.log('nananana', element, depthParentPid, depth);
              elPid = parseInt(element.val());
            }
  //console.log('queryAddElement', criteries, element.val());
  if ('check' in criteries)
    criteries['check']['parent']=elPid;
  else
    criteries['check'] = {'parent':elPid};
  //criteries['check']['type']=criteries['data']['parentNameKey1'];
    sendQeury(urls.getNomType1, criteries).done(function(result){
        //console.log('queryadd_el', criteries, result, element);
        if('data' in result && result['data'].length > 0){
          oThis.level=parseInt(oThis.level+1);
          for(var el in result['data']) {
            var rel = result['data'][el];
            //console.log('debug', rel['parent'], element.attr('type'));
            if (rel['parent'] != element.attr('type')) continue;
            //console.log('rel',rel);
            if (!rel['type'] in oThis.NomTypes)
              oThis.NomTypes[rel['type']] = rel;
            /*
            var elPid=null;
            if (depth > 0 && undefined !== depthParentPid && NaN != parseInt(depthParentPid))
              elPid = parseInt(depthParentPid);
            else {
              //console.log('nananana', element, depthParentPid, depth);
              elPid = parseInt(element.val());
            }*/
            rel['criteries'] = {'parent':elPid,'type': rel['type'],'status':1};
            rel['parent'] = element.attr('level');
            rel['level'] = parseInt(oThis.level);
            element.removeClass('float-left col-lg-7 col-md-7 col-sm-12');
            oThis.containerEl.find('[levb='+oThis.level+']').remove();
            //if(true == rel['nullable'] && rel['baseNomCount'] < 1) {
              // do not add elements that can be null and have 0 basenoms!!!
              //addedEl = null;
            //} else
              addedEl = oThis.addElement(rel,element, depth++);
            // WARNING: this will cause recursion whel rel is nullable. all nullables will be added till not-nullable or EOT is reached
            if (true === rel['nullable'] && depth<30 && !(rel['type'] in oThis.BaseNomLoad)
              && rel['baseNomCount'] < 1) {
            //console.error('inbnl',rel['type'], rel['type'] in oThis.BaseNomLoad);
            //if (true === rel['nullable'] && depth<30) {
              var crit = {'data':{'parentNameKey1':rel['type']}};
              console.log('recurse',addedEl,crit,elPid)
              oThis.queryAddElement(addedEl, crit, ++depth, elPid)
            }
          //oThis.level=parseInt(oThis.level+50);
          }
        }else{
          if ('baseNomCount' in result && result['baseNomCount']==0) {
            if (oThis.params.addChildButton != false) {
              $(that).addClass('float-left check col-lg-7 col-md-7 col-sm-12');
              oThis.containerEl.find('[levb='+oThis.level+']').remove();
              button = '<button class="ml-5 btn btn-success col-lg-3 col-md-3 col-sm-12 callChildNomtype" '
                        +'levb='+oThis.level+'>Add new child</button> ';
              $(button).insertAfter(that);
            }
          }
        }
    });
}


BaseNomTreeType.prototype.addElement = function(data, parent) {
  var oThis = this;
    //console.log('addEl',data,parent);

    var level = parseInt(data['level']);
    var childLevel = parseInt(level+1);
    elementClass ='form-control check';
    button ='';
    //add name
    name = '';
    fildName = data['type'].split('.');
    if(this.params['name'] && this.params['name']=='form') {
        name = 'name="'+this.formName+'[nomtypes]['+fildName[1]+']"';
    }
    if(!this.params['noname']) {
        name = 'name="'+this.params['targetElName']+'"';
    }
    if(this.params['name'] && this.params['name'] == 'entity') {
        //name = 'name="'+formId+'[nomtypes]['+fildName[1]+']"';
        //name = 'name="'+formId+'['+fildName[1].toLowerCase()+']"';
        name = 'name="'+this.formName+'['+fildName[1]+']"';
    }
    var fieldId = this.formId+'_'+fildName[1];
    sp ='<div id="element_'+level+'" class="baseNomsParents">'
        +'  <div class="form-group row validate">'
        +'    <label id="label_'+level+'" class="col-form-label col-lg-3 col-sm-12">'+data['label']+'</label>'
        +'    <div class="col-lg-9 col-md-9 col-sm-12">'
        +'      <select class="'
                      +elementClass
                      +'" id="'+fieldId
                      +'" level="'+level
                      +'" type="'+data['type']
                      +'" child="'+data['child']
                      +'" '+(data['nullable']===true?' is-nullable="'+data['nullable']:' required="required')
                      +'" '+name
                      +' childLevel='+childLevel
                      +' parent="'+data['parent']+'" '
                      +' parentType="'+parent.attr('type')+'" '
                      +' parent="'+data['criteries']['parent']+'"'
                      +' im-insert="true" aria-describedby="type-error">'+
                      '</select>'+button
                      + '<div class="error invalid-feedback"><ul class="errorHolder"></ul></div>'
        +'</div></div></div>';
    // TODO: set proper insert path
    //if (this.containerEl.length>0)
      this.containerEl.append($(sp));//.append(closest('div.nomtree div.form-group'));
    //else
      //$(sp).insertAfter(parent.closest('div.form-group'));
      //this.containerEl.insertAfter(parent.closest('div.form-group'));
    //  throw "containerEl not set?!??";

    var dataId=null;

    if(this.parentData[data['type']]){
        // this selects first element, when no BNomLoad is set.
        //dataId = this.parentData[data['type']]['id'];
    }
    var showExtra = true;
    if ('showExtra' in this.params) {
      showExtra = this.params['showExtra'];
      //console.log('params',params);
    }
    if(data['extraFields'].length>0 && showExtra){
       this.addExtra(data['extraFields'], level, fieldId);
    }

    //console.error('CALL loadNomData with data', data);
  //if (data  instanceof Object && 'baseNomCount' in data && data['baseNomCount'] > 0) {
  if (data  instanceof Object && 'baseNomCount' in data && data['baseNomCount'] > 0 &&
      'data' in data && null !== data['data'] && 'count' in data['data'] && data['data']['count'] > 0) {
      // get-nom-type1 delivered our noms data opts. fill in with it.
      // no loadchild needed
      var elData = data['data'];
      this.passData(this.containerEl.find('#'+fieldId), elData, data, dataId,dataId);
    } else {
      // we don't have noms data opts. fiill witg loadchild
      this.loadNomData(this.containerEl.find('#'+fieldId), data,dataId,dataId);
    }
  //} else {
    // no data in db - disable element.
    //this.containerEl.find('#'+fieldId).attr('disabled','disabled');
  //}
    //this.loadNomData(this.containerEl.find('#'+fieldId), data,dataId,dataId);
    //setTimeout(function () { var el = oThis.containerEl.find('#'+fieldId);
    //  console.log('focus',el);
    //  el.focus();
    //},50);
    return this.containerEl.find('#'+fieldId);
}

BaseNomTreeType.prototype.addExtra = function(data,level, fieldId) {
    console.log('Add extra', level, fieldId, data);
    $.each(data, function(key,value) {
        console.log(key,value);
      if (value == 'nullable') return; // system value - means fld can be nulled
      if (value.substr(0,4) == 'sys_') return true; // system key. do not show!
      if (value != 'child') {
        sp ='<div  id ="ex'+key+'" class="baseNomNameExtra">'
            +  '<div class="form-group row validate">'
            +'    <label class="col-form-label col-lg-3 col-sm-12">Extra: '+value+'</label>'
            +'    <div class="col-lg-9 col-md-9 col-sm-12">'
            +'      <input type="text" class="form-control name extraFields"  im-insert="true" '
            +'          aria-describedby="type-error" name="extraFields['+value+']" value="" />'
            +'<div></div></div>';
        //$(sp).insertAfter($('[level='+level+']').closest('div.form-group'));
        $(sp).insertAfter(this.containerEl.find('#'+fieldId).closest('div.form-group'));
      }
    })

}

BaseNomTreeType.prototype.loadNomData = function(el, value,id,addNew) {
  var oThis = this;
    data = {
        'data':{
        'criteries':value['criteries'],
        'e':true,
        'req':'basenomtree',
      }
    }
    //var el = el.find('select[level="'+this.level+'"]','[type="'+value['type']+'"]');//.prevObject;
    //console.log('fill in ',el)
    sendQeury(urls.basenom_load_child1, data)
    .done(function(result) {
      if('data' in result) {
        oThis.passData(el, result['data'],value,id,addNew);
      } else {
        oThis.addEmptyVals(el,true);
      }
    });
}

BaseNomTreeType.prototype.addEmptyVals = function(el,selNew) {
  el.append($("<option></option>"));
  if (this.params instanceof Object && 'addNew' in this.params && this.params['addNew'] == true)
    el.append($("<option></option>").attr("selected",'selected').attr("value",'new').text('--New--'));
  if(selNew)
    el.change();
}

BaseNomTreeType.prototype.nomValidate = function(el) {
  var count0el = 1;
  var errors = [];
  if (this.params instanceof Object && 'addNew' in this.params && this.params['addNew'] == true)
    count0el++;
  if (el.find('option').length <= count0el && el.attr('is-nullable') != 'true') {
    var elParentId = el.attr('parent');
    elParentId = this.containerEl.find('select[level='+elParentId+']').val();
    if (parseInt(elParentId)>0)
      errors.push('can not be empty. <a href="'+urls.basenom_list+'/?lpid='+elParentId+'&type='+el.attr('parenttype')+'" target="_blank">Edit the nom tree.</a>');
  }
  //console.log('novalel', el.find('option'), el.find('option').length, count0el, errors);

  var errorStr = '';
  if (errors.length>0) {
    for(var i=0;i<errors.length;i++) {
      errorStr += '<li>'+errors[i]+'</li>';
    }
    //console.log(el.find('option'), el.find('option').length, count0el, errors, errorStr)
    //TODO form validation!
  }
  $(el).parent().find('ul.errorHolder').html(errorStr);

}

BaseNomTreeType.prototype.passData = function(select,data,value,id,addNew) {
  var oThis = this;
    var level = parseInt(value['level']);
    var prevType;//,select;
    //select=$(select);
    //console.log('passdata', select, data, value,id,addNew)
    if (data['count'] == 0 && (this.params['addNew'] === undefined || this.params['addNew'] !== true)
    ) {
      // if element has no data AND we can't add new - disable!!! (do not remove - remove breaks child/parent id) --remove element!!!
      // Otherwise we will get empty value in form (last el will be empty and no value can be added)
      //$(select).parent().parent().parent().remove();
      //console.log('rmel',select);
      $(select).attr('disabled','disabled');


    }
    if (data['count']==0) {
      select.empty();
      this.addEmptyVals(select);
      //if(addNew)
        select.change();
    }

    var selected = false;
    var hasSelected = false;
    $.each(data[value['type']], function(key,val) {
      //console.log('passdata loop', key,val,select);
      if (val['type'] != prevType) {
        //select = oThis.containerEl.find('[level="'+level+'"]','[type="'+val['type']+'"]').prevObject;
        select.empty();
        select.append($("<option></option>"));

        //if(value['child']!=0){
        if ('addNew' in oThis.params && oThis.params['addNew'] == true)
          select.append($("<option></option>").attr("value",'new').text('--New--'));
        //}
        //console.log('passdata-loop-'+key, val, select, 'find: ', '[level="'+level+'"]','[type="'+val['type']+'"]')
      }
      selected = false;
      //console.error('is loaded', oThis.BaseNomLoad, oThis.BaseNomLoad[val['type']],val['type']);
      if (val['type'] in oThis.BaseNomLoad) {
        id = oThis.BaseNomLoad[val['type']]['id'];
        if (oThis.params.tree['disableSelected'] == true)
          select.attr('disabled', 'disabled');
        //console.log('set selected id', result['data'],id, BaseNomLoad[nltype]['id'])
      }
      select.attr("parent",val['parent'])
      if(id==val['id']){
        //console.log('SET SELECTED', id, val['id']);
        selected = 'selected';
        hasSelected = true;
      }
      //console.log('check bnomload', val['type'], BaseNomLoad)
      el = $("<option></option>").attr("value",val['id']).attr("selected",selected).attr("parent",val['parent']);
      if(val['extra']){
        el.attr('child',val['extra']['child']).text(val['value']);
      }else{
        el.text(val['value']);
      }
      select.append(el);
      if(addNew && val['id'] == id['id'] && val['type'] == id['type']){
          //select.change();
      }
      prevType = val['type'];
    })
    //console.log('is id iobj', id);
    //if (id instanceof Object === true && 'id' in id) {
    //console.error('IS INIT',this.isInit, this.params['tree']['focusSelectedOnInit']);
    if ((this.isInit == true && this.params['tree']['focusSelectedOnInit'] == true) || this.isInit == false) {
      select.focus();
    }
      if (hasSelected) {
        //console.log('SET NEW TO ', id['id']);
        setTimeout(function() {
          //select.val(id['id']);
          select.change();
        },150);
      }
    //}
    this.nomValidate(select,data);
    if (this.isInit) this.isInit = false;

}

BaseNomTreeType.prototype.addBaseNom = function(obj) {
    //console.log('addBaseNom', obj, obj.parent);
    var parentType = $(obj).attr('parentType');
    var parent = $(obj).parent().parent().parent().parent().find('[type="'+parentType+'"]')
    var parent = parseInt(parent.val());
    var objType = $(obj).attr('type');
    var level = $(obj).attr('level');
    //parseInt($('#'+formId+'_crissue option:selected').val())
    var label = $(obj).parent().parent().find('label').text();//#label_'+level);//$('#label_'+obj.attr('level')).text();
    /*
    var url='/adm/base_nom/add?parent='+parent+'&type='+parentType;
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

    var newElement = prompt("Please enter new "+label,'');
    newElement = $.trim(newElement);
    if(newElement != null&&newElement != ''){

        //parent = obj.attr('parent')||false;

        //if(parent){
        //    parent =$('[level="'+parent+'"]').val();
        //}

        objType = obj.attr('type');

        insertData = {'data':{'p':parent,'t':objType,'val':newElement}};
        sendQeury(urls.basenom_add_new, insertData).done(function(data){
            if(data instanceof Object == true) {
              if (undefined !== data['success'] && true == data['success'] && parseInt(data['id'])>0) {
                if(data['error']){
                    alert(data['error']);
                    return false;
                }
                crs = {'id':obj.attr('id'),'level':level,'type': insertData['data']['t'], 'criteries':{'parent':insertData['data']['p'],'type':insertData['data']['t']},'child':obj.attr('child')};
                //console.log('added.call loadNomData in 2 sec');
                //setTimeout(function() {
                  this.loadNomData(obj, crs,data,true);
                //},2000);
              }
            }
        })

    }else{
        $(obj).children("option:selected").removeAttr('selected');
        $(obj).children("option:first").attr('selected','selected');
        return false;
    }
}


BaseNomTreeType.prototype.clearChild = function(element) {
    child = this.containerEl.find(element).attr('childLevel')||false;
    //console.error('clearchild', element, child);

    while(child){
        child = child.replace('.','');
        hasChild = this.containerEl.find('[level="'+child+'"]').attr('childLevel')||false;
        //console.error('CLEARCH',child, '#element_'+child);
        var rmel = [1];
        var maxrm = 60;
        var rmcnt = 0;
        while(rmel.length != 0 || rmcnt < maxrm) {
          rmel = this.containerEl.find('#element_'+child).remove();
          rmcnt++;
        }
        child = hasChild;
    }
    this.containerEl.find('.last').remove();
}