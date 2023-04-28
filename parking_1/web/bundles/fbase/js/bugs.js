$(function() {
    $('#_bugs_dialog').each(function() {
        var $this = $(this),
            user_submit = false;
        $this.find('.btn-primary').click(function() {
            var data = {};
            $('#k_content_body form').each(function() { // each form in body
                var form_data = {},
                    $form = $(this),
                    form_name = $('#k_content_body form').length==1 ? document.title : $form.attr('id'),
                    unknown = 1,
                    getValues = function($row, values) {
                        $row.find('input, select, textarea').each(function() { // each html field
                            var $this = $(this),
                                name = $this.attr('placeholder') || $this.attr('name') || $this.attr('id'),
                                tmp;
                            if ($this.parents('label.k-checkbox').length) {
                                name = $this.parents('label.k-checkbox').text().replace(/(^\s+)|(\s+$)/g, '');
                                tmp = !!$this.attr('checked');
                            } else {
                                if ($this.is('select')) {
                                    if ($this.is('[multiple]')) {
                                        tmp = {};
                                        $this.find(':selected').each(function() {
                                            tmp[this.value] = this.innerText.replace(/(^\s+)|(\s+$)/g, '');
                                        })
                                    } else {
                                        if ($this.val()=='' || $this.val()==0) {
                                            tmp = '--';
                                        } else {
                                            tmp = $this.find(':selected').text().replace(/(^\s+)|(\s+$)/g, '') + ' (ID: '+$this.val() + ')';
                                        }
                                    }
                                } else if ($this.is('textarea')) {
                                    tmp = $this.val();
                                } else if ($this.is('[type=checkbox]')) {
                                    tmp = !!$this.attr('checked');
                                } else if ($this.is('[type=radio]')) {
                                    if ($this.is('checked')) {
                                        tmp = true;
                                    }
                                } else {
                                    tmp = $this.val();
                                }
                            }
                            if (tmp!==undefined && name && tmp!='dummy data' && name.indexOf('[dummyField]')==-1) {
                                values[name || ('unknown' + (unknown++))] = tmp;
                            }
                        })
                    },
                    getRowsValues = function($block) {
                        var tab_data = {};
                        $block.find('.form-group').each(function() { // each form field
                            var values = {},
                                $row = $(this);
                            if ($row.find('ul').length) { // dynamic forms
                                values = [];
                                $row.find('li').each(function() {
                                    if (!$('*', this).is('button')) {
                                        values[values.length] = {};
                                        getValues($(this), values[values.length-1]);
                                    }
                                })
                            } else { // fields
                                getValues($row, values);
                            }
                            tab_data[$row.find('>label').text().replace(/(^\s+)|(\s+$)/g, '') || ('unknown' + (unknown++))] = values;
                        });
                        return tab_data;
                    },
                    readTabbedForm = function($form) {
                        var form_data = {};
                        $form.find('.nav-tabs:first li').each(function() {
                            var tab_name = $(this).text().replace(/(^\s+)|(\s+$)/g, ''),
                                $tab = $('div.tab-pane'+$('a', this).attr('href'));
                            if ($tab.find('.nav-tabs li').length) {
                                form_data[tab_name] = readTabbedForm($tab);
                            } else {
                                form_data[tab_name] = getRowsValues($tab);
                            }
                        });
                        return form_data;
                    };
                if ($form.find('.nav-tabs')) {
                    data[form_name] = readTabbedForm($form.find('>div'));
                } else {
                    data[form_name] = getRowsValues($form);
                }
            });
            data = {
                url: window.location+'',
                forms: data,
            };
            $('#bugs_form_pageForms').val(JSON.stringify(data, null, 4));
            user_submit = true;
            $('#kform_id_bugs_form').submit();
        });
        $('#bugs_form_type option:first', this).remove();
        $this.bind('formValidationEnd', function(event) {
            if (user_submit) {
                if (typeof event.originalEvent.detail.returnData == "string") {
                    $this.modal('hide');
                    $this.find('#bugs_form_description').attr('placeholder', $this.find('#bugs_form_description').val()).val('');
                    alert(event.originalEvent.detail.returnData);
                }
                user_submit = false;
            }
        })
    })
})