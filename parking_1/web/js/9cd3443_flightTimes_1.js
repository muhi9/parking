(function() {
    var timeProps = {
        'engineTime':{
            's':0,
            'e':0,
            'target':'blockTime',
            'errors':{
                's': 'Start Up < Block Off',
                'e': 'Shut down > Block On'
            },
            'fields_labels':{
                's':'Start Up',
                'e':'Shut down',
            } 
        },
        'blockTime':{
            's':0,
            'e':0,
            'target':'airTime',
            'errors':{
                's': 'Block Off < Takeoff',
                'e': 'Block On < Shut down'
            },
            'fields_labels':{
                's':'Block Off',
                'e':'Block On',
            } 
        },
        'airTime':{
            's':0,
            'e':0,
            'last':true,
            'target':'blockTime',
            'errors':{
                's': 'Takeoff > Block Off',
                'e': 'Landing < Block On'
            },
            'fields_labels':{
                's':'Takeoff',
                'e':'Landing',
            }
        },
        'gpsTime':{
            's':0,
            'e':0,
            'fields_labels':{
                's':'GPS Start',
                'e':'GPS Stop',
            }
        },  
    },
    fuelProps = {
        'lastFuel' : {
            'value': '', 
            'units': ''
        },
        'fuelUplifted' : {
            'value': '', 
            'units': ''
        },
        
        'fuelBeforeFlight':{
            'value': '', 
            'units': ''
        },
        'fuelAfterFlight':{
            'value': '', 
            'units': ''
        },
        'fuelUsed':{
            'value': '', 
            'units': ''
        },
        'fuelRefueled':{
            'value': '', 
            'units': ''
        },
    },
    oilProps = {
        'lastOil' : {
            'value': '', 
            'units': ''
        },
        'oilUplifted' : {
            'value': '', 
            'units': ''
        },
        
        'oilBeforeFlight':{
            'value': '', 
            'units': ''
        },
        'oilAfterFlight':{
            'value': '', 
            'units': ''
        },
        'oilUsed':{
            'value': '', 
            'units': ''
        },
        'oilRefueled':{
            'value': '', 
            'units': ''
        },
    },
    /*fuelProps = {
        'fuelBeforeFlight':{
            'fields': {
                'field1':'lastFuel',
                'field2':'fuelUplifted'
            },
            'operator': 'add'
        },
        'fuelUsed':{
            'fields':{
                'field1':'fuelBeforeFlight',
                'field2':'fuelAfterFlight'
            },
            'operator': 'sub' 
        },
    },
    oilProps = {
        'oilBeforeFlight':{
            'fields':{
                'field1':'lastOil',
                'field2':'oilUplifted'
            },
            'operator': 'add'
        },
        'oilUsed':{
            'fields':{
                'field1':'oilBeforeFlight',
                'field2':'oilAfterFlight'
            },
            'operator': 'sub' 
        },
    },*/
	base = siteUrl,
    log_tab_index = {},
    flightFrom = $('#flightbundle_flight_flightFrom').val()*1000||0,
    flightTo = $('#flightbundle_flight_flightTo').val()*1000||0;

    $('.calendar.flight-times').each(function(){
        log_tab_index[$(this).attr('id')] = $(this).attr('tabindex');
    });

    formid ='flightbundle_flight';// $(document).find('form').attr('name');
    //onload
    checkTachoHobbs($('#flightbundle_flight_aircraft'));
    loadProps();

    $('#flightbundle_flight_flight').on('change',function(){
      //  checkTachoHobbs(this);
    });
    $('#flightbundle_flight_aircraft_label').bind('autocomplete_change', function(event, data) {
        $('#form_flightbundle_flight_tachoStop input, #form_flightbundle_flight_hobbsStop input').val(0);
        $('.calculateFuel input, .calculateOil input').val('');
        $('.calculateFuel input[type="checkbox"], .calculateOil input[type="checkbox"]').prop('checked', false);
        checkTachoHobbs($('#flightbundle_flight_aircraft'));
        
    });

    //calendar
    $(document).on('changeDate','.flight-times', function(evt) {
        loadProps();
        /*if (evt.date !== undefined ) {
            var key = $(this).attr('r');
            var sub = $(this).attr('t');
            if(key&&sub){
                var date = new Date(evt.date);
                var time = $('#'+$(this).attr('id')+'_time').val()||'00:00';
                time = time.split(':');
                date.setHours(time[0],time[1]);
                timeProps[key][sub] = date.getTime();
                checkTimes(timeProps[key],$(this),key);
            }
        }*/
    })

    //time
    $(document).on('changeTime','.time.flight-times ', function(evt) {
        loadProps();
        /*var calendar = $('#'+$(this).attr('id').replace('_time',''));
        var key = $(calendar).attr('r');
        var sub = $(calendar).attr('t');
        var date = $(calendar).datepicker('getDate');
        if(date!=null){
            var time = $(this).val().split(':');
            timeProps[key][sub] = date.setHours(time[0],time[1]);
            checkTimes(timeProps[key],calendar,key);
        }*/
    });

    $('#flightbundle_flight_startup').on('changeDate', function(evt) {
        if (evt.date !== undefined ) {
            if($('#flightbundle_flight_same_day').is(':checked')) {
                $('.calendar.flight-times:not(#flightbundle_flight_startup, #flightbundle_flight_gpsStop, #flightbundle_flight_gpsStart)').datepicker('update', evt.date).val();
                loadProps();
                $('.calendar.flight-times:not(#flightbundle_flight_startup, #flightbundle_flight_gpsStop, #flightbundle_flight_gpsStart)').attr('enableOnReadonly',true).attr('tabindex',-200).attr('readonly',true).css({'pointer-events':'none'});
            }
        }
    })

    $('#flightbundle_flight_same_day').change(function(){
        if($(this).is(':checked')) {
            date =  $('#flightbundle_flight_startup');

            if(date.val() !=''){
                $('.calendar.flight-times:not(#flightbundle_flight_startup, #flightbundle_flight_gpsStop, #flightbundle_flight_gpsStart)').datepicker('update', date.val()).val(date.val());
                loadProps();
                $('.calendar.flight-times:not(#flightbundle_flight_startup, #flightbundle_flight_gpsStop, #flightbundle_flight_gpsStart)').attr('enableOnReadonly',false).attr('readonly',true).attr('tabindex',-200).css({'pointer-events':'none'});
            }

        }else{
            $('.calendar.flight-times:not(#flightbundle_flight_startup, #flightbundle_flight_gpsStop, #flightbundle_flight_gpsStart)').attr('enableOnReadonly',true).attr('readonly',false).css({'pointer-events':'auto'});
            $('.calendar.flight-times').each(function(){
                $(this).attr('tabindex',log_tab_index[$(this).attr('id')]);
            })
        }
    })

    $(document).on('change','.calc',function(){
        c = $(this);
        hm = 0;
        n = $('#'+formid+'_'+c.attr('o'));
        r = $('#'+formid+'_'+c.attr('r'));
            r.val(null);
            $('.invalid-feedback', c.closest('div')).text('');
            $('.invalid-feedback', n.closest('div')).text('');
            result = (c.attr('t')=='s')?parseFloat(n.val())-parseFloat(c.val()):parseFloat(c.val())-parseFloat(n.val());
            if(result>0){
                    console.log('rname',r.attr('name'), result);
                if (r.attr('name').indexOf('tacho')>-1 || r.attr('name').indexOf('hobbs')>-1) {
                    r.val(result.toFixed(2));
                } else {
                    r.val(result.toFixed(1));
                }
            }else{
                c.closest('div').append($('<div class="invalid-feedback">end > start !</div>'));
                n.closest('div').append($('<div class="invalid-feedback">end > start !</div>'));
            }
    })
    //fmskab-400
    //calc fuelBeforeFlight
    $(document).on('change', '#flightbundle_flight_lastFuel, #flightbundle_flight_fuelUplifted', function(){
        let field1 = $('#flightbundle_flight_lastFuel').val()||0,
            field2 = $('#flightbundle_flight_fuelUplifted').val()||0; 
            targetVal = calculateFuelOil({'field1':convert(field1, fuelProps.lastFuel.units, fuelProps.fuelBeforeFlight.units), 'field2':convert(field2, fuelProps.fuelUplifted.units, fuelProps.fuelBeforeFlight.units)}, 'add');
           $('#flightbundle_flight_fuelBeforeFlight').val(targetVal.toFixed(2));
    })
    //calc fuelUsed
    $(document).on('change', '#flightbundle_flight_fuelBeforeFlight, #flightbundle_flight_fuelAfterFlight', function(){
            let field1 = $('#flightbundle_flight_fuelBeforeFlight').val()||0,
                field2 = $('#flightbundle_flight_fuelAfterFlight').val()||0; 
                targetVal = calculateFuelOil({'field1':convert(field1, fuelProps.fuelBeforeFlight.units, fuelProps.fuelUsed.units ), 'field2':convert(field2, fuelProps.fuelAfterFlight.units, fuelProps.fuelUsed.units )}, 'sub');
               $('#flightbundle_flight_fuelUsed').val(targetVal.toFixed(2)); 
    })
    //calc oilBeforeFlight
    $(document).on('change', '#flightbundle_flight_lastOil, #flightbundle_flight_oilUplifted', function() {   
            let field1 = $('#flightbundle_flight_lastOil').val()||0,
                field2 = $('#flightbundle_flight_oilUplifted').val()||0; 
                targetVal = calculateFuelOil({'field1':convert(field1, oilProps.lastOil.units, oilProps.oilBeforeFlight.units), 'field2':convert(field2, oilProps.oilUplifted.units, oilProps.oilBeforeFlight.units)}, 'add');
               $('#flightbundle_flight_oilBeforeFlight').val(targetVal.toFixed(2));
    })
    //calc oilUsed
    $(document).on('change', '#flightbundle_flight_oilBeforeFlight, #flightbundle_flight_oilAfterFlight', function(){
            let field1 = $('#flightbundle_flight_oilBeforeFlight').val()||0,
                field2 = $('#flightbundle_flight_oilAfterFlight').val()||0; 
                targetVal = calculateFuelOil({'field1':convert(field1, oilProps.oilBeforeFlight.units, oilProps.oilUsed.units), 'field2':convert(field2, oilProps.oilAfterFlight.units, oilProps.oilUsed.units)}, 'sub');
               $('#flightbundle_flight_oilUsed').val(targetVal.toFixed(2)); 
    })

    $('.calculateFuel select').change(function(event, data){
            field = $(this).closest('.row').find('input'),
                regex = /([a-z0-9_]*)(?:\[([a-z0-9_]*)\])/ig,
                matches = regex.exec(field.attr('name'));
            if(fuelProps[matches[matches.length-1]]) {
                temp_val = convert(field.val(), fuelProps[matches[matches.length-1]].units, $(this).val()); 
                field.val(parseFloat(temp_val).toFixed(2));    
                fuelProps[matches[matches.length-1]] = {
                    'units':$(this).val(),
                    'value':field.val()
                };
                field.change();
            }            
    });
    
    $('.calculateOil select').change(function(event, data){
            field = $(this).closest('.row').find('input'),
                regex = /([a-z0-9_]*)(?:\[([a-z0-9_]*)\])/ig,
                matches = regex.exec(field.attr('name'));
            
            if(oilProps[matches[matches.length-1]]) {
                temp_val = convert(field.val(), oilProps[matches[matches.length-1]].units, $(this).val()); 
                field.val(parseFloat(temp_val).toFixed(2));
                oilProps[matches[matches.length-1]] = {
                    'units':$(this).val(),
                    'value':field.val()
                };
                field.change();
            }

    });

    /*
    $(document).on('change', '.calculateFuel input', function(){
        $.each(fuelProps, function(target, props){
            
            let field1 = $('#'+formid+'_'+props.fields.field1).val()||0,
                field2 = $('#'+formid+'_'+props.fields.field2).val()||0; 
            //if(field1 != '' && field2 != ''){
               targetVal = calculateFuelOil({'field1':field1, 'field2':field2},props.operator);
               $('#'+formid+'_'+target).val(targetVal);
            //}
        })
    })
    $(document).on('change', '.calculateOil input', function(){
        $.each(oilProps, function(target, props){
            let field1 = $('#'+formid+'_'+props.fields.field1).val()||0,
                field2 = $('#'+formid+'_'+props.fields.field2).val()||0; 
            
            //if(field1 != '' && field2 != ''){
               targetVal = calculateFuelOil({'field1':field1, 'field2':field2},props.operator);
               $('#'+formid+'_'+target).val(targetVal);
            //}
        })
    })
    */
    function calculateFuelOil(val, operator){
        result = 0.00;
        if(operator == 'add') {
            result = parseFloat(val.field1) + parseFloat(val.field2); 
        }
        if(operator == 'sub') {
            result = parseFloat(val.field1) - parseFloat(val.field2); 
        }
        return result>=0?result:0.00;
    }    
    
    
    function checkTimes(times, resultElement) {
        
        if(times.e > 0 && times.s > 0){
            $('[r='+resultElement+']').each(function(e,v){
               $(this).parent('.date').find('.invalid-feedback').remove();
            })

            if(times.e < times.s){
                $('[r='+resultElement+']').parent('.date').append($('<div class="invalid-feedback">'+times.fields_labels.e+' > '+times.fields_labels.s+'!</div>'));
                $('#'+formid+'_'+resultElement).val(msToHMS(0));
            }else{
                $('#'+formid+'_'+resultElement).val(msToHMS((times.e-times.s)));
            }
            
            //compare logs #FMSKAB-211
            if(timeProps[times.target]) {
                if((times.s > timeProps[times.target].s && !times.last) ||(times.s < timeProps[times.target].s && times.last)) {
                    $('[r='+resultElement+']').last().parent('.date').append($('<div class="invalid-feedback">'+times.errors.s+' !</div>'));
                }

                if((times.e < timeProps[times.target].e && !times.last) || (times.e > timeProps[times.target].e && times.last)) {
                   $('[r='+resultElement+']').first().parent('.date').append($('<div class="invalid-feedback">'+times.errors.e+' !</div>'));
                }
            }
        }

        
        
        
    }

    function calclulate(timesProp) {
        $.each(timesProp, function(total, times){
            checkTimes(times, total);
        })
    }

    function msToHMS( ms ) {
          var seconds = ms / 1000;
          var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
          seconds = seconds % 3600; // seconds remaining after extracting hours
          var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
          seconds = seconds % 60;
          return (hours<10?'0':'')+hours+":"+(minutes<10?'0':'')+minutes;
    }


    function checkTachoHobbs(element){
        var val = $(element).val();
        if(val>0){
            $('.ajax_loading_mask_logs').show();
            data = {'fields':['tacho','hobbs','tachoStart','hobbsStart'],'criteries':{'id':val}};
            $.ajax({method:'post', url:urls.aircraft_read_list, data:{'data':data},datatype:'json',
                success: function(result){

                    //console.log(result, result[val]);
                    if(result!=0){
                        if (result[val].tacho) {

                            //console.log('dbg tacho',$('#flightbundle_flight_tachoStart').val(), result[val].tachoStart, ($('#flightbundle_flight_tachoStart').val()||result[val].tachoStart), parseFloat($('#flightbundle_flight_tachoStart').val()||result[val].tachoStart))
                            //$('#flightbundle_flight_tachoStart, #flightbundle_flight_tachoStop, #flightbundle_flight_tachoTime').closest('div.form-group').show();
                            $('#flightbundle_flight_tachoStart, #flightbundle_flight_tachoStop, #flightbundle_flight_tachoTime').prop('disabled',false);
                            tacho = parseFloat($('#flightbundle_flight_tachoStart').val());
                            console.log($('#flightbundle_flight_tachoStart').val());
                            if (tacho == '0.00')
                                tacho = parseFloat(result[val].tachoStart);
                            $('#flightbundle_flight_tachoStart').val(tacho.toFixed(2));
                        } else {
                            //$('#flightbundle_flight_tachoStart, #flightbundle_flight_tachoStop, #flightbundle_flight_tachoTime').closest('div.form-group').hide();
                            $('#flightbundle_flight_tachoStart, #flightbundle_flight_tachoStop, #flightbundle_flight_tachoTime').prop('disabled',true);
                        }

                        if (result[val].hobbs) {
                       //     $('#flightbundle_flight_hobbsStart, #flightbundle_flight_hobbsStop, #flightbundle_flight_hobbsTime').closest('div.form-group').show();
                          $('#flightbundle_flight_hobbsStart, #flightbundle_flight_hobbsStop, #flightbundle_flight_hobbsTime').prop('disabled',false);
                          hobbs = parseFloat($('#flightbundle_flight_hobbsStart').val());
                          console.log($('#flightbundle_flight_hobbsStart').val());
                          if (hobbs == '0.00')
                              hobbs = parseFloat(result[val].hobbsStart);
                          $('#flightbundle_flight_hobbsStart').val(hobbs.toFixed(2));
                        } else {

                         //   $('#flightbundle_flight_hobbsStart, #flightbundle_flight_hobbsStop, #flightbundle_flight_hobbsTime').closest('div.form-group').hide();
                         $('#flightbundle_flight_hobbsStart, #flightbundle_flight_hobbsStop, #flightbundle_flight_hobbsTime').prop('disabled',true);
                        }
                        
                        //last fuel
                        if (result[val].lastFuel) {
                           lastFuel = $('#flightbundle_flight_lastFuel').val();
                            
                            if(lastFuel == '') {
                                $('#flightbundle_flight_lastFuel').val(result[val].lastFuel);    
                            }
                            if($('#flightbundle_flight_fuelBeforeFlight').val() == ''){
                                $('#flightbundle_flight_fuelBeforeFlight').val($('#flightbundle_flight_lastFuel').val());
                            }
                        }
                        //last oil
                        if (result[val].lastOil) {
                            lastOil = $('#flightbundle_flight_lastOil').val();
                            if (lastOil == '') {
                                $('#flightbundle_flight_lastOil').val(result[val].lastOil);
                            }
                            if($('#flightbundle_flight_oilBeforeFlight').val() == ''){
                                $('#flightbundle_flight_oilBeforeFlight').val($('#flightbundle_flight_lastOil').val());
                            }
                        }
                    }
                },
            })
            $('.ajax_loading_mask_logs').hide();
        }

    }
    function loadProps(){
     //return false;
        $('#tabs_logs .calendar').each(function(evt){
            if($(this).val()!='') {

                $(this).datepicker({
                    'format':i18n.date_format
                })
                date = $(this).datepicker('getDate');
                if (date) {
                    var key = $(this).attr('r');
                    var sub = $(this).attr('t');
                    if(key&&sub) {
                        var date = new Date(date);
                        var time = $('#'+$(this).attr('id')+'_time').val()||'00:00';
                        time = time.split(':');
                        date.setHours(time[0],time[1]);
                        timeProps[key][sub] = date.getTime();
                    }
                }
           }
        })
        //load fuel oil props
        $.each(fuelProps, function(field, props){
           that = $('[name="'+formid+'['+field+']"]')||false;
           if(that.length > 0){
                val = $('[name="'+formid+'['+field+']"]').val();
                unit = that.closest('.row').find('select').val();
                props.value = val;
                props.units = unit;
           }
        })
        $.each(oilProps, function(field, props){
           that = $('[name="'+formid+'['+field+']"]')||false;
           if(that.length > 0){
                val = $('[name="'+formid+'['+field+']"]').val();
                unit = that.closest('.row').find('select').val();
                props.value = val;
                props.units = unit;
           }
        })
        // calc time props
        calclulate(timeProps);

    }
})();