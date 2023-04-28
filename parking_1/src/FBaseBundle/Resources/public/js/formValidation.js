var isSubmited = false;
var EventValidationEnd = new CustomEvent(
  "formValidationEnd",
  {
    detail: {
      formUrl: null,
      formData: {},
      returnData: {},
      time: new Date(),
    },
    bubbles: true,
    cancelable: true
  }
);
function formValidation() {
    var forms = $('form'),
        formChanges = [];
    if (arguments.length > 0) {
        var pass = arguments[0];
        if(!Array.isArray(pass))
            forms = $([arguments[0]]);
        else
            forms = $(arguments[0]);
    }

    // CHANGED FIELDS ALERT - confirm
    $(window).on('beforeunload', function() {
        if (formChanges.length) {
            return 'Are you sure you want to leave?';
        }
    });
    // CHANGED FIELDS ALERT - confirm

    forms.each(function() {
        var fel = $(this).css('position', 'relative'),
            mask = $('<div class="ajax_loading_mask"><div><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>');
        //console.log('form',fel);
        var validationType = fel.data('validation-type')||'validate'; // only | skip | validate
        if (validationType == 'skip')
            return true;

        var action = fel.attr('action') || location.href;
        //if (fel.action && fel.action.length > 0)
        //    action = fel.action;
        //console.log('validate action',action);
        // append button name that has been clicked - this way we can have different buttons for 1 form
         $(":submit",fel).click(function(){
            if($(this).attr('name') && fel.find(':submit').length>1) {
                fel.find('input[name="'+fel.attr('name')+'_submit_button"]').remove()
                fel.append(
                    $("<input type='hidden'>").attr( {
                        name: fel.attr('name')+'[_submit_button]',
                        value: $(this).attr('name'),
                        //value: $(this).attr('value')
                    })
                );
            }
        });
        // CHANGED FIELDS ALERT - save init values
        fel.find('input, select, textarea').each(function() {
            $(this).data('init-value', $(this).val());
        })
        // CHANGED FIELDS ALERT - save init values
        // CHANGED FIELDS ALERT - check for changed values
        if (fel.is('[enable-unsaved-changes-alert]')) {
            fel.change(function(event) {
                var $this = $(event.target),
                    data = $this.data('init-value');
                if (data!==$this.val() && $this.parents().filter('th, tr.filter, thead, table[role=grid]').length<4) {
                    formChanges[formChanges.length] = $this;
                }
            });
        }
        // CHANGED FIELDS ALERT - check for changed values
        $(document).on('submit', fel, function(el) {
        //fel.submit(function(el) {
            mask.fadeTo(0, 0).appendTo(fel).fadeTo('slow', 1);
            //clear all invalid classes before we call validation.
            fel.find('input,select,textarea,submit,button').each(function() {
                if ($(this).hasClass('is-invalid'))
                    $(this).removeClass('is-invalid');
                if ($(this).parent().find('.invalid-feedback').length>0)
                    $(this).parent().find('.invalid-feedback')[0].remove()
            })

            var ell = el;
            var frm = new FormData(fel[0]);
            frm.append('validationRequest', validationType);

            if(!isSubmited){
                isSubmited = true;
                var xhr = sendQeury(action, frm);
                // on server error - enable resubmit
                xhr.fail(function(jqXHR, textStatus, errorThrown) {
                    isSubmited = false;
                });
                var hasError = false;
                xhr.done(function(data,textStatus, jqXHR) {
                    if(data['formErrors'] === undefined) {
                        // if no errors. enable resubmission after 3 sec
                        setTimeout(function() { isSubmited=false; }, 3000);
                    }
                    if(data['formErrors'] !== undefined) {
                        // if form errors, enable immediatelly
                        isSubmited=false;
                        var errors = data['formErrors'];
                        var focused = false,
                            errorFields = $();
                        for(var field in errors) {
                            //override fileName field so we find where to put the error
                            var filetype = ['diskName', 'path', 'entityClass', 'entityId', 'mimeType'];
                            for(var ft in filetype) {
                                if (field.indexOf(filetype[ft])>-1) {
                                    errors[field] = null;
                                    field = field.replace('.'+filetype[ft], '][fileName');
                                    errors[field] = 'File must be selected';
                                }
                            }
                            // clean up specific day/month/year field as validator returns from dates.
                            // just use plain field
                            // eg. {"formErrors":{"user_form[document][1][issued][year]":"This value is not valid."}}
                            // should become {"formErrors":{"user_form[document][1][issued]":"This value is not valid."}}
                            // so the field gets recognized
                            var tdmy = ['day','month','year'];
                            for (var dmy in tdmy) {
                                var testName = field.substr((field.length-tdmy[dmy].length-1),tdmy[dmy].length);
                                if (testName == tdmy[dmy]) {
                                    field = field.substr(0,(field.length-(tdmy[dmy].length+2)));
                                }
                            }
                            var fld = fel.find('[name="'+field+'"]');
                            if (fld.length==0) {
                                // lets try to find arrays of fields like this.
                                fld = fel.find('[name="'+field+'[]"]');
                            }
                            if (fld.length==0) {// check collections
                                fld = $('ul[data-prototype]').filter(function() {
                                    return $(this).data('prototype').indexOf(field)!=-1;
                                });
                                fld.parent().addClass('validate');
                            }

                            if (fld.length==0) {// check files
                                fld = fel.find('[name="'+field+'[fileName]"]');
                            }

                            console.log('invalid field/s/', field, fld, errors[field]);
                            if (fld.length==1
                             || (fld.length>1 && $(fld[0]).attr('id').substr(0,6) == 'kform_' && $(fld[0]).is('select'))
                             || (fld.length>1 && $(fld[1]).attr('id').substr(0,6) == 'kform_' && $(fld[1]).is('select'))
                            ) {
                                if (fld.length > 1) {
                                    if((fld.length>1 && $(fld[0]).attr('id').substr(0,6) == 'kform_' && $(fld[0]).is('select')))
                                        fld = [fld[0]];
                                    else if((fld.length>1 && $(fld[1]).attr('id').substr(0,6) == 'kform_' && $(fld[1]).is('select')))
                                        fld = [fld[1]];
                                    else
                                        throw "Error finding proper element to show error!!!";
                                }
                                //console.log('invalid field', fld);
                                hasError = true;
                                fld = $(fld[0]);
                                if (!fld.hasClass('is-invalid'))
                                    fld.addClass('is-invalid');
                                //scroll to focus?
                                if (fld.parent().find('.invalid-feedback').length>0) {
                                    fld.parent().find('.invalid-feedback').html(errors[field]);
                                } else {
                                    fld.after('<div class="invalid-feedback">'+errors[field]+'</div>');
                                }
                                //if (!focused) {
                                    errorFields = errorFields.add(fld);
                                    //focused = showElement(fld);
                                //}
                            } else if (fld.length>1) {
                                var ferrel = fld.parent().parent().parent();
                                console.log('show error1', errors[field], ferrel)
                                if (ferrel.length>0) {
                                    var errel = $(ferrel[0]).parent().find('.invalid-feedback');
                                    if (errel.length==1) {
                                        errel=$(errel[0]);
                                        errel.html(errors[field]);
                                        setTimeout(function() {
                                            if (errel.css('display') == 'none') {
                                                errel.css('display','block');
                                            }
                                        }, 500);
                                    } else {
                                        $('<div class="invalid-feedback" style="display:block;">'+errors[field]+'</div>').insertAfter(ferrel[0]);
                                    }
                                    //if (!focused) {
                                        errorFields = errorFields.add(fld[0]);
                                        //focused = showElement(fld[0]);
                                    //}
                                } else {
                                    $('<div class="form-group row  validate"><div class="invalid-feedback">'+errors[field]+'</div></div>').insertBefore(fel.find('[type="submit"]')[0]);
                                }
                            } else {
                                var ferrel = fel.find('[type="submit"]').parent().find('div.form-group');
                                console.log('show error2', errors[field], ferrel)
                                if (ferrel.length>0) {
                                    ferrel.html('<div class="invalid-feedback">'+errors[field]+'</div>');
                                } else {
                                    $('<div class="form-group row  validate"><div class="invalid-feedback">'+errors[field]+'</div></div>').insertBefore(fel.find('[type="submit"]')[0]);
                                }
                            }
                        }
                        showElement(errorFields.first());
                    } else {
                        // CHANGED FIELDS ALERT - clear changed fields
                        for (var i=formChanges.length-1; i>=0; i--) {
                            if (!formChanges[i].length || formChanges[i].parents('form:first').is(fel)) {
                                formChanges.splice(i, 1);
                            }
                        }
                        // CHANGED FIELDS ALERT - clear changed fields
                    }
                    if (data['redirectTo'] !== undefined) {
                        if (data['windowOpen'] !== undefined) {

                            window.open(data['windowOpen'], '_blank');
                            //newTab(data['windowOpen']);
                            setTimeout(function() {
                                location.href = data['redirectTo'];
                            }, 500)

                        //    var iframe = $("<iframe>", {name: 'dwiframe', id: 'dwiframe'}).appendTo("body").hide();
                        //    listenForIframeReady($(iframe), data['redirectTo']);
                            setTimeout(function() { $('#dwiframe').attr('src', data['windowOpen']); }, 500);

                        } else
                        location.href = data['redirectTo'];
                    } else {
                        var furl = fel.attr('action');
                        if (!furl || furl.length < 1)
                            furl = document.location.href;
                        EventValidationEnd['detail']['formUrl'] = furl;
                        EventValidationEnd['detail']['returnData']=data;
                        EventValidationEnd['detail']['formData']=fel.serializeArray();
                        fel.get(0).dispatchEvent(EventValidationEnd);
                        mask.fadeTo('slow', 0, function() {
                            mask.detach();
                        });
                    }
                });
               // setTimeout(function(){ isSubmited=false; }, 5000);

            }
            if (validationType != 'skip') {
                el.preventDefault();
                return false;
            }
        });
    });
    //$('form[name="coursesbundle_default_issuerevision"] [name="coursesbundle_default_issuerevision[issue]"]')
}
/*
function newTab(url)
{
    var tab=window.open("");
    tab.document.write("<!DOCTYPE html><html>"+document.getElementsByTagName("html")[0].innerHTML+"</html>");
    tab.document.close();
    window.location.href=url;
}
*/
// read-only forms
$(function() {
    $('form[readonly][readonly!=""]').find('input, select, textarea, button').attr({disabled:true, readonly:true}).filter('[type=submit], .btn.add, .btn.btn-danger').remove();
})

// Next / Save buttons
$(function() {
    $('[type=submit][next][next!=""]').each(function() {
        var button = $(this),
            next_string = button.html(),
            save_string = button.attr('next'),
            next_class = button.attr('nextClass')||false,
            form = button.parents('form:first');

        function findNextToClick(parent) {
            var result = $();
            $($('.nav-tabs:visible', parent).get().reverse()).each(function() {
                result = result.length ? result : $('.active', this).parent().nextAll(':visible').first();
            });
            return result;
        };
        function clickCallback() {
            return findNextToClick(form).find('a').click().trigger('click').length==0;
        }
        button.click(clickCallback);
        form.find('li.nav-item, li.nav-item a').click(function() {
            setTimeout(function() {
                if (findNextToClick(form).length==0) {
                    if(next_class){
                         button.attr('class',next_class);
                    }

                    button.html(save_string).unbind('click', clickCallback);
                }else{
                    $('body,html').scrollTop($('#k_header').height() - 25);
                }
            }, 250); // give it a time!!!
        });
    })
});
