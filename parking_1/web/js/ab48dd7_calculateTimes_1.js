function flightTimesCalculate(form, settings){
    if (this===window) {
        return new flightTimesCalculate(form, settings);
    } else {
        this.form_name = form;
        this.form = $('#kform_id_'+form);
        this.taskTo = $('#'+form+'_taskTo');
        this.flightFrom = $('#'+form+'_flightFrom');
        this.flightTo = $('#'+form+'_flightTo');
        this.flightType = $('#'+form+'_flightType');
        this.crewPosition = $('.flightPosition');
        this.student = $('#'+form+'_student');
        this.checkNextExercise = $('#checkNextExercise');
        this.lastFlightDateField = $('#'+form+'_lastFlight');
        this.lastFlightTimeField = $('#'+form+'_lastFlight_time');
        this.requireInstructor = $('#'+form+'_requireInstructor');
        //this.notRequireInstructor = $('#_not_require_instructor').val()||false;
        this.user_field = '#'+form+'_user_label';
        //this.isAdmin = $('#_user_is_admin').length;
        //this.autoLoadNextExercises = $('#_auto_load_next_exercises').val()||false;
        this.isAdmin = settings._user_is_admin;
        this.autoLoadNextExercises = settings._auto_load_next_exercises;
        this.notRequireInstructor = settings._not_require_instructor;
        this.currentSolo = settings._pic_current_solo;
        this.currentPassanger = settings._pic_current_passanger;
        this.hasCourse = settings._user_has_course;
        this.settings = settings;

        this.init();
        this.checkDependetFields();
    }
}

flightTimesCalculate.prototype = {
    taskFrom:null,
    taskFrom_time:null,
    preBriefing:null,
    flightTime:null,
    postBriefing:null,
    //currentSolo: $('#_pic_current_solo').val()||null,
    //currentPassanger: $('#_pic_current_passanger').val()||null,
    currentSolo: null,
    currentPassanger: null,
    
    userNextExercise: [],
    exercises: [],
    crew: {},
    exerciseRequireInstructor:{},
    passanger_role: 'ROLE_PASSENGER',
    ground_instructor_role: 'flights-crew positions-ground instructor',
    pic_role: 'pic',
    instructor_role: 'instructor',
    user_id: 0,
   // hasCourse: $('#_user_has_course').val()||false,
    hasCourse: false,
    maxAllert: 4, //show max 5 times
    settings:{},

    fields: [
            '_taskFrom',
            '_taskFrom_time',
            '_preBriefing',
            '_flightDuration',
            '_postBriefing',
        ],


    init: function() {
        var that = this;
        //focus first field  FMSKAB-??
        //that.form.find('input').first().focus();

        //that.user_id = $('#'+that.form_name+'_user').val();
        that.user_id = this.student.val();
        that.setStudent();
        for (var i=0; i<this.fields.length; i++) {
            that.fields[i] = '#'+that.form_name+that.fields[i];
        }
        //time fields
        that.form.on('change', that.fields.join(', '), function(ev) {
            if($(this).attr('id')==that.fields[0].substr(1)){ //taskFrom calendar
               //FMSKAB-289
               // $(that.fields[1]).val(''); //taskFrom time
               // $(that.fields[3]).val(''); //flightDuration time
            }

            that.calculate();
        })

        // get selected exercises
        that.loadExercises();

        //select client
        that.form.on('autocomplete_change', that.user_field, function(event, data){
            /* FMSKAB-312
            that.userNextExercise = [];
            that.exercises = [];
            that.hasCourse = data.hasCourse;
            that.user_id = data.id;
            //get currents from pic in flight not from client 22.11.2021
            //that.currentSolo = null;
            //that.passangersCurrent = null;
           /* if(data.soloCurrent){
                that.currentSolo = new Date(data.soloCurrent.date);
                that.currentSolo = that.currentSolo.getTime()/1000;
            }
            if(data.passangersCurrent){
                that.currentPassanger = new Date(data.passangersCurrent.date);
                that.currentPassanger = that.currentPassanger.getTime()/1000;
            }*/
            /*that.lastFlight(data);
           // that.checkRequireInstructor();
            that.checkDependetFields();
            that.userNextExercise = data.nextExercise;
            that.checkActiveCourse();
            //that.nextExercise();
            */

        })
        that.form.on('autocomplete_change', '[id*="_flight_departure_label"], [id*="_flight_arrival_label"], .dynamic.landings .ui-autocomplete-input', function(event, data) {
            that.checkAirport($(this).parent().parent().parent().parent(), data);
        })
         // ALERT for create new user passanger - crew
        that.form.on('autocomplete_change', '.dynamic.crew .ui-autocomplete-input', function(event, data) {
            if(!data.id && data.value != '') {
                if(confirm('Passenger doesn\'t exist. Should a new one be created? '+data.value)) {
                    $position = $(this).parents('.row:first').find('select[name*="[position]"]');
                    $position.find('option:not([data-key="ROLE_PASSENGER"])').attr('disabled', true);
                    $position.val($position.find('option[data-key="ROLE_PASSENGER"]').val());
                } else {
                    $(event.currentTarget).val('');
                }
            }else{
                //get currents from pic in flight not from client 22.11.2021
                $position = $(this).parents('.row:first').find('select[name*="[position]"]');
                option_key =  $position.find('option:selected').data('key');

                that.crew[option_key] = data;

                if(option_key == 'pic') {
                    that.currentSolo = null;
                    that.currentPassanger = null;

                    if(data.soloCurrent){
                        that.currentSolo = new Date(data.soloCurrent.date);
                        that.currentSolo = that.currentSolo.getTime()/1000;
                    }
                    if(data.passangersCurrent){
                        that.currentPassanger = new Date(data.passangersCurrent.date);
                        that.currentPassanger = that.currentPassanger.getTime()/1000;
                    }
                    that.checkRequireInstructor();
                }
                //#FMSKAB - 313
                setTimeout(function() {
                    that.crew_add();
                }, 100);
                //#FMSKAB - 310
                setTimeout(function() {
                    that.setStudent();
                }, 100);
                that.setCrewUserInfo($(this).closest('.row'), data);
            }
        });

        $('.crew').on('change', 'select', that.disable_crew_options).bind('row.add', function() {
            var $select = $('.crew > li:last').prev().find('select');
            if ($select.data('added')) { // remove row event
                setTimeout(function() {
                    that.disable_crew_options();
                }, 50);
            } else { // add row event
                $select.data('added', true);
                setTimeout(function() {
                    that.disable_crew_options();
                    $select.val($select.find('option:not(:disabled):first').val());
                    that.disable_crew_options();
                }, 50);
            }
        });

        that.disable_crew_options();
        //
        //exercise and aircraft
        $('#kform_id_'+this.form_name).on('focus','.dynamic.details .ui-autocomplete-input, #'+this.form_name+'_aircraft_label',function(event, data){
          that.checkDependetFields();
        });

        that.form.on('autocomplete_change', '.dynamic.details .ui-autocomplete-input', function(event, data){
            if(data.id) {
                $(this).attr('data-cid', data.id);
                that.exerciseRequireInstructor[data.id] = data.require_instructor;
                if(that.exercises.indexOf(data.id) == -1){
                    that.exercises.push(data.id);
                }
                that.checkRequireInstructor();
            }else {
                delete that.exerciseRequireInstructor[$(this).data('cid')];
                if(that.exercises.indexOf($(this).data('cid')) > -1){
                   that.exercises = that.exercises.splice(parseInt($(this).data('cid')), 1);
                }
            }
            that.checkRequireInstructor();
        })

        $(document).on('click', '.details-remove', function(event, data){
               row = $(this).closest('li');
               temp_id = $('input[type="hidden"]',row).val();
               delete that.exerciseRequireInstructor[temp_id];
               if(that.exercises.indexOf(parseInt(temp_id)) > -1){
                   that.exercises = that.exercises.splice(parseInt(temp_id), 1);
                }
               that.checkRequireInstructor();
        })
        //flightType and CrewPosition
        that.flightType.on('change',function() {
          that.checkRequireInstructor();
          that.checkActiveCourse();
          that.exercises = [];
          that.loadExercises();
          //#FMSKAB - 313
          that.disable_crew_options();
          //that.nextExercise();
        });
        // CrewPosition
        $('#kform_id_'+this.form_name).on('change','.flightPosition',function() {
            row = $(this).closest('.row');
            //$('.typeahead', row).find('.clearbut').click();
            $('.typeahead', row).find('input[name*="[user]"]').data('api').clear();
            that.checkRequireInstructor();
        });

        $(document).on('before_remove','.remove-position',function(event, data) {

            $position = $(data).find('select[name*="[position]"]');
            option_key =  $position.find('option:selected').data('key');
            if(that.crew[option_key]) {
                delete that.crew[option_key];
            }
            that.setStudent();
            that.checkRequireInstructor();
        });

        //check for user next exercise
        that.checkNextExercise.on('click', function(){
            that.getUserNextExercises();
        })
        
        if(that.autoLoadNextExercises > 0) {
            that.checkNextExercise.click();
        }

        that.checkRequireInstructor();

    },
    calculate: function(){

        //reset times
        this.flightFrom.val(0);
        this.flightTo.val(0);
        this.taskTo.val(0);


        this.taskFrom = $('#'+this.form_name+'_taskFrom').datepicker('getDate');
        //datepick($('#'+this.form_name+'_taskFrom'));

        this.taskFrom_time = $('#'+this.form_name+'_taskFrom_time').val()||false;
        this.preBriefing = $('#'+this.form_name+'_preBriefing').val()||false;
        this.flightTime = $('#'+this.form_name+'_flightDuration').val()||false;
        this.postBriefing = $('#'+this.form_name+'_postBriefing').val()||false;
        if(this.taskFrom&&this.taskFrom_time&&this.preBriefing&&this.flightTime&&this.postBriefing){
            tmp =  parseInt(this.timeTosec(this.taskFrom_time)+this.timeTosec(this.preBriefing));//flighFrom
            console.log('fs:'+this.secTotime(tmp));

            dof = new Date(this.taskFrom);
            flightStart = new Date(dof.setSeconds(tmp));// secTotime();

            tmp = parseInt(tmp+this.timeTosec(this.flightTime));//flighTo
            console.log('fe:'+this.secTotime(tmp));

            dof = new Date(this.taskFrom);
            flightEnd = new Date(dof.setSeconds(tmp));

            tmp = parseInt(tmp+this.timeTosec(this.postBriefing));//TaskEnd
            console.log('te:'+this.secTotime(tmp));

            dof = new Date(this.taskFrom);
            taskToTime = new Date(dof.setSeconds(tmp));

            this.flightFrom.val((flightStart/1000)||0); //js time to timestamp
            this.flightTo.val((flightEnd/1000)||0); //js time to timestamp
            this.taskTo.val((taskToTime/1000)||0); //js time to timestamp
            //fmska-32
            if($('[id$="_flight_departure_label"]').length > 0 && $('[id$="_flight_departure"]').val()) {
                $('[id$="_flight_departure_label"]').data('api').reload();    
            }

            if($('[id$="_flight_arrival_label"]').length > 0 && $('[id$="_flight_arrival"]').val()) {
                 $('[id$="_flight_arrival_label"]').data('api').reload();
            }
            $('.dynamic.landings input.ui-autocomplete-input').each(function(key, input){
                tmp_row = $(input).parent();
                if($('input[type="hidden"]', tmp_row).val()){
                    $(input).data('api').reload();    
                }
                  
            });
        }
        this.checkRequireInstructor();
        this.checkDependetFields();
    },
    lastFlight: function(userData) {
        this.lastFlightDateField.datepicker('destroy');
        this.lastFlightDateField.val(userData.lastFlight).text(userData.lastFlight).attr('enableOnReadonly',true).attr('readonly',false).css({'pointer-events':'auto'});
        datepick(this.lastFlightDateField);

        if(userData.lastFlight) {
            this.lastFlightDateField.val(userData.lastFlight).text(userData.lastFlight);
            //if(!this.isAdmin) {
                this.lastFlightDateField.attr('enableOnReadonly',false).attr('readonly',true).css({'pointer-events':'none'});
            //}
            this.lastFlightDateField.datepicker('destroy');
            //this.lastFlightDateField.datepicker({'enableOnReadonly':false});
        }
    },
    loadExercises: function() {
        var that = this;
        $('ul.exercises_ul li:not(:last-child) input:last-child').each(function(key, input){
            if(input.value) {
                that.exercises.push(parseInt(input.value));
            }
        })    
    },
    nextExercise: function() {

        var row = $('ul.exercises_ul');
        var that = this;
        if(this.flightType.find('option:selected').data('key') == 'training') {
            temp_cexеr = typeof this.userNextExercise === 'object'?Object.keys(this.userNextExercise).length:this.userNextExercise.length;
            if(temp_cexеr > 0) {
                var ul = $(row).first().data('prototype')||'';

                $.each(this.userNextExercise, function(key, nextExercise) {
                    //check if the exercise is the list
                    if(that.exercises.indexOf(nextExercise.id) == -1) {
                        var tmp = ul.replace(/__name__/g, nextExercise.id);
                        tmp = tmp.replace(/_label" value=""/g, '_label" value="'+nextExercise.name+'"');
                        tmp = tmp.replace(/value=""/g, 'value="'+nextExercise.id+'"');
                        $(tmp).insertBefore(row.find('li:last-child'));
                        $('#'+that.form_name+'_flightDetails_'+nextExercise.id+'_autoAdd').val(1);
                        
                        that.exercises.push(nextExercise.id,'next');
                    }
                })
            }
        }else{
            $(row).find('li:not(:last-child)').remove();
        }

    },
    checkRequireInstructor: function() {
        if (this.requireInstructor.length > 0) {
            this.requireInstructor.closest('label').css('pointer-events','auto');
            this.requireInstructor.prop('checked',false).attr('readonly',false);

            var temp_required = false;

            //get type
            var flightType = this.flightType.find('option:selected').data('key');
            //get position
            var positions = [];
            $('.flightPosition option:selected').each( function(index, value){
                 positions.push($(this).data('key'));
            })
            //courseRequaredInsructor ||
            if (this.flightFrom.val() > this.currentSolo){
                temp_required = true;
            }

            if (flightType == 'training') {
                temp_exerciseRequireInstructor = false;
                $.each(this.exerciseRequireInstructor,function(key, value){
                    if(value){
                        temp_exerciseRequireInstructor = true;
                        return false;
                    }
                })
                if(positions.includes(this.passanger_role) || temp_exerciseRequireInstructor) {
                    temp_required = true;
                }
            }

            if(flightType == 'rent' && (positions.includes(this.passanger_role) && this.flightFrom.val() > this.currentPassanger)) {
                temp_required = true
            }

            if(positions.includes(this.ground_instructor_role) || positions.includes(this.instructor_role)) {
                //temp_required = false;
            }
            if(temp_required) {
                $temp_checked = true;
                if (!this.isAdmin) {
                    this.requireInstructor.closest('label').css('pointer-events','none');
                    this.requireInstructor.attr('readonly', true);
                }else{
                    $temp_checked = this.notRequireInstructor?false:true;
                }
                this.requireInstructor.prop('checked', $temp_checked);
            }
        }
    },
    checkDependetFields: function(){
        $('.dynamic.details .ui-autocomplete-input, #'+this.form_name+'_aircraft_label, #'+this.form_name+'_user_label,  #'+this.form_name+'_departure_label, #'+this.form_name+'_arrival_label').each(function(i,element){
            isDependet = $(this).closest('.typeahead').attr('isDependet')||false;
            if(!isDependet){
                return;
            }
            $(this).prop('disabled',false);
            row = $(this).closest('.form-group');
            $('.invalid-feedback',row).remove();

            pass = true;
            fields = $(this).data('fields');

            var error_message = [];
            $.each(fields,function(k,field){
                selector = $('#'+field);
                selector.removeClass('is-invalid');
                if(selector.val()==''||selector.val()==0){
                    pass = false;
                    selector.addClass('is-invalid');
                    tempLabel = selector.closest('div.row').find('label').first().text();
                    label = selector.attr('error_msg')||selector.closest('div.row').find('.typeahead').first().attr('error_msg')||(tempLabel!=''?tempLabel+' is required!':'');
                    error_message.push(label);

                }
            })

            if(!pass){
                if(isDependet){
                    $(this).prop('disabled',true);
                }
                if(error_message){
                    var msg = '<div class="invalid-feedback">'+error_message.join('<br />')+'</div>'
                    field = $(this).attr('id');
                    if(field){
                        field = field.replace('_label','');
                        $(msg).insertAfter($("#"+field));
                        $(this).val('');
                        $("#"+field).val(0);
                    }

                }
            }

        })
    },
    getUserNextExercises: function(){
        var that = this;
        if(that.user_id > 0){

            sendQeury(urls.profile_last_flight,{'id':that.user_id}).done(function(result){
                that.userNextExercise = result.nextExercise||[];
                that.nextExercise();
            })


        }

    },
    checkActiveCourse: function() {
        if(this.hasCourse && this.flightType.find('option:selected').data('key') != 'training') {
            this.callMessage(this.maxAllert);
        }
    },
    callMessage: function(count) {
        var that = this;
        swal({
                title: "Attention",
                text: "The client has an active Course. Are you ABSOLUTELY SURE this Flight shouldn't be a Training one!!??",
                type: "warning"
            }).then(function() {
                if(count){
                    count--;
                    that.callMessage(count);
                }
            });
    },
    disable_crew_options: function() {

        let flightType = $('select[name*="flightType"]').find('option:selected').data('key');
        let position = {};

        $('.crew select[name*="[position]"] option').attr('disabled', false);
        $('.crew select[name*="[position]"] option:selected:not([data-key="ROLE_PASSENGER"])').each(function() {
            $select = $(this).parent();
            $select.data('added', true);
            position[$select.attr('id')] = $(this).data('key');
            let row = $(this).closest('.row');
            $('.crew select:not([id="'+$(this).parent().attr('id')+'"]) option[value="'+$(this).val()+'"]').attr('disabled', true);
            if(flightType != 'training') {
                //remove added
                $('.crew option:selected[data-key="dual"]').closest('li').remove();
                //disable new
                $('.crew select[name*="[position]"] option[data-key="dual"]').attr('disabled', true);


            }
        });

        let temp_positions = Object.values(position);
        let temp_select = Object.keys(position);
        $('.crew-li-error').remove();
        if(flightType == 'training') {
            if(temp_positions.length >= 2
                && temp_positions.indexOf('pic') > -1
                && temp_positions.indexOf('flights-crew positions-ground instructor') > -1
                && temp_positions.indexOf('instructor') == -1) {
                //disabled options
                //$('.crew select:not([id="'+temp_select[temp_positions.indexOf('pic')]+'"], [id="'+temp_select[temp_positions.indexOf('flights-crew positions-ground instructor')]+'"]) option').attr('disabled', true);
                
                $('.crew li select:not([id="'+temp_select[temp_positions.indexOf('pic')]+'"], [id="'+temp_select[temp_positions.indexOf('flights-crew positions-ground instructor')]+'"])').closest('li').each(function(){
                    $(this).append('<p class="crew-li-error text-center text-danger">cannot choose this role on current configuration</p>');
                })
            }

        }
    },
    /*crew_validations: function() {
        var that = this;
        let crews = {};
        $('.crew select[name*="[position]"] option:selected').each(function() {
            crews[$(this).parent().attr('id')] = $(this).data('key');
        });

        let temp_positions = Object.values(crews);
        let temp_select = Object.keys(crews);
        if(that.flightType.find('option:selected').data('key') == 'training') {
            if(temp_positions.length > 2
                && temp_positions.indexOf(that.pic_role) > -1
                && temp_positions.indexOf(that.ground_instructor_role) > -1
                && temp_positions.indexOf(that.instructor_role) == -1 ) {

                $('.crew select:not([id="'+temp_select[0]+'"], [id="'+temp_select[1]+'"]) option').attr('disabled', true);
            }
        }
        if(that.flightType.find('option:selected').data('key') == 'rent') {
            //$('.crew select[name*="[position]"] option[data-key="dual"]').attr('disabled', true);
        }
    },*/
    crew_add: function () {
        let that = this,
            flightType = $('select[name*="flightType"]').find('option:selected').data('key'),
            crew = {},
            instructor_element = null;

        $('.crew select[name*="[position]"] option:selected').each(function() {
            let row = $(this).closest('li');
            crew[$(this).data('key')] = {
                    'id': row.find('input[name*="[user]"]').val(),
                    'name': row.find('input.ui-autocomplete-input').val(),
                    'link': row.find('a').attr('href'),
                    'image': row.find('img').attr('src')||false,
                };
        });

        let crew_positions = Object.keys(crew);
        if(flightType == 'training') {

            if(crew_positions.indexOf('pic') > -1
                && crew_positions.indexOf('dual') > -1
                && crew.pic.id !=''
                && crew_positions.indexOf('instructor') ==  -1 )
            {
                const d = new Date();
                let time = d.getTime();
                tmp = '';
                $('.crew li:last .add').click();
                li = $('.crew li').eq(-2);
                li.find('select option[data-key="instructor"]').attr('selected', 'selected');
                li.find('input[name*="[user]"]').data('api').setCurrent({'id':crew.pic.id, 'value':crew.pic.name});
                /*ul = $('.crew').data('prototype')||'';
                tmp += ul.replace(/__name__/g, parseInt(time));
                row =  $(tmp).insertBefore('.crew > li:last');
                row.find('select option[data-key="instructor"]').attr('selected', 'selected');
                row.find('input[name*="[user]"]').data('api').setCurrent({'id':crew.pic.id, 'value':crew.pic.name});
                */
                //window[that.form_name+'_crew_'+parseInt(time)+'_user_autocomplete']['current'] = {'id':crew.pic.id, 'value':crew.pic.name};
                //row.find('input[name*="[user]"]').val(crew.pic.id);
                //row.find('input.ui-autocomplete-input').val(crew.pic.name);
                //row.find('input:first').val(crew.pic.name);
                //row.find('a').attr('href', crew.pic.link);
                //row.find('img').attr('src', crew.pic.image);

                that.disable_crew_options();
                that.crew['instructor'] = that.crew.pic;

                setTimeout(function() {
                    row.find('a').css('opacity','1');
                }, 500);

            }

        }
    },
    setStudent: function() {

        var that = this;
        let flightType = $('select[name*="flightType"]').find('option:selected').data('key'),
            instructor_element = null;

        let crew_positions = Object.keys(that.crew);

        temp_studentId = that.student.val();
        temp_studentPosition = '';
        if(flightType == 'training') {
            if(crew_positions.indexOf('dual') > -1 && that.crew.dual.id ) {
                temp_studentId = that.crew.dual.id;
                temp_studentPosition = 'dual';
            }else if(crew_positions.indexOf('pic') > -1 && that.crew.pic.id ) {
                temp_studentId = that.crew.pic.id;
                temp_studentPosition = 'pic';
            }
        } else {
            if(crew_positions.indexOf('pic') > -1 && that.crew.pic.id ) {
                temp_studentId = that.crew.pic.id;
                temp_studentPosition = 'pic';
            }
        }
        $('ul.exercises_ul li:last-child button').prop('disabled', temp_studentId?false:true);

        if(that.student.val() != temp_studentId) {
            //remove exercises
            $('ul.exercises_ul li:not(:last-child)').remove();

            that.userNextExercise = [];
            that.exercises = [];
            that.loadExercises();
            that.hasCourse = that.crew[temp_studentPosition].hasCourse;
            that.user_id = that.crew[temp_studentPosition].id;
            that.lastFlight(that.crew[temp_studentPosition]);
           // that.checkRequireInstructor();
            that.checkDependetFields();
            that.userNextExercise = that.crew[temp_studentPosition].nextExercise;
            that.checkActiveCourse();
            //that.nextExercise();
        }
        that.student.val(temp_studentId);
        that.user_id = that.student.val();
    },
    setCrewUserInfo: function($parentElement, data) {
        $infoBox = $('.crew_user_info', $parentElement);  
        $infoBox.html(' ');
        if(data.lastFlight != '' && data.lastFlight != undefined) {
            $infoBox.append('<span> Last flight: <b><i>'+data.lastFlight+'</i></b></span>');
        }
        if(data.soloCurrent != '' && data.soloCurrent != null) {
            $infoBox.append('<span> Solo current until: <b><i>'+msToDate(new Date(data.soloCurrent.date).getTime(), 'dd.mm.yyyy')+'</i></b></span>');
        }
        if(data.passangersCurrent != '' && data.passangersCurrent != null) {
            $infoBox.append('<span> Passengers current until:  <b><i>'+msToDate(new Date(data.passangersCurrent.date).getTime(), 'dd.mm.yyyy')+'</i></b></span>');
        }
    },
    checkAirport: function($parentElement, data) {
        $infoBox = $('.airport_info', $parentElement);  
        $infoBox.html(' ');
        if(!data.isAvailable) {
            $infoBox.append('Check working time');
        }
    },
    timeTosec: function(time){
            var a = time.split(':');
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60;
            return seconds;
    },
    secTotime: function(seconds){
            var h = Math.floor(seconds / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            return h+':'+m;
    },
}


