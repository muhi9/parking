// x Init sections method
// x Init timelines method
// x Init global method
// x Clear timeline method
// x populate events on timeline method
// x add disabled event type
// * drag n drop event on timeline
// x Display events on different than day views
    // ! click -> goes to day view
    // ! back button (remember view)

const STORE_PERIOD_SLUG = 'ec_period_slug';
const STORE_START_DATE = 'ec_start_date';
const STORE_END_DATE = 'ec_start_date';
const END_DATE = 'ec_end_date';
const SUN_INFO = 'sun_info';
const FILTERS = 'filters';
const TIMERANGE = 'time_range';
const SCROLLTO = 'last_update';
var timelinesArray = {};
var status_colors = JSON.parse(settings.status_colors);
var timeline_colors = JSON.parse(settings.timeline_colors);

var createdBox;

$( document ).ready(function() {
    
    //POPOVERS
    
    //clear all pop up
    $('body').on('click',  function(e) {
        if ($(e.target).parents('.timeline__event').length === 0) { 
            $('.popover').popover('hide');
        }
    })
    
    //close current pop up
    $(document).on('click', '.close-popover', function(){
        $(this).closest('.popover').remove();
    })
    $(document).on('click', '.timeline__label a', function(){
        console.log('rw');
    })
    //CALENDARS

    const today = moment().format('YYYY-MM-DD');

    //$('#current-period').datepicker('setStartDate', today);
    
    // set default state vars in Local Storage
    // default period is 'day';
    // possible values: 'day'|'week'|'2weeks'|'3weeks'|'4weeks'|'month';
    localStorage.setItem(STORE_PERIOD_SLUG, 'day');

    // default start date is today
    localStorage.setItem(STORE_START_DATE, moment().format('YYYY-MM-DD'));
    localStorage.setItem(STORE_END_DATE, moment().format('YYYY-MM-DD'));
    localStorage.setItem(END_DATE, moment().format('YYYY-MM-DD'));
    // default FILTERS
    localStorage.setItem(FILTERS,'');
    // default TIMERANGE
    let defaultTimeRange = $('[data-time-period].active').data('time-period');
    localStorage.setItem(TIMERANGE, JSON.stringify(defaultTimeRange));
    

    $('#current-period').datepicker({
        rtl: KUtil.isRTL(),
        todayBtn: "linked",
        clearBtn: false,
        todayHighlight: true,
        format:  i18n.date_format,
        autoclose: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }).on('changeDate', function(evt){
        localStorage.setItem(STORE_START_DATE, moment(evt.date).format('YYYY-MM-DD'));
        localStorage.setItem(END_DATE, moment(evt.date).format('YYYY-MM-DD'));
        //updateDateButton();
        setFilters();

    });
    
    
    //filters
    $('#booking_start').on('changeDate', function(event) {
        //console.log('changeDate');
        
        if(event.date != 'undefined' ) {
            //localStorage.setItem(STORE_START_DATE, moment(event.date).format('YYYY-MM-DD')); 
            //console.log('start date '+moment(event.date).format(i18n.date_format.toUpperCase()));
            //$('#booking_end').datepicker('setStartDate', moment(event.date).format(i18n.date_format.toUpperCase()));
            //$('#booking_end').datepicker('setEndDate', moment(event.date).add(1, 'M').format(i18n.date_format.toUpperCase()));
        }
    }).on('hide', function(event){
        if(event.date !== undefined ) {
            localStorage.setItem(STORE_START_DATE, moment(event.date).format('YYYY-MM-DD')); 
            //console.log('start date '+moment(event.date).format(i18n.date_format.toUpperCase()));
            $('#booking_end').datepicker('setStartDate', moment(event.date).format(i18n.date_format.toUpperCase()));
            $('#booking_end').datepicker('setEndDate', moment(event.date).add(1, 'M').format(i18n.date_format.toUpperCase()));
        } else {
            $('#booking_end').datepicker('setStartDate', -Infinity);
            $('#booking_end').datepicker('setEndDate', Infinity); 
        }
    })

   
    $('#booking_end').on('changeDate', function(event) {
        //console.log('changeDate');
        if(event.date !='undefined' ) {
          //  localStorage.setItem(END_DATE , moment(event.date).format('YYYY-MM-DD'));
           // console.log('end date '+moment(event.date).format(i18n.date_format.toUpperCase()));
           // $('#booking_start').datepicker('setStartDate', moment(event.date).subtract(1, 'M').format(i18n.date_format.toUpperCase()));
            //$('#booking_start').datepicker('setEndDate', moment(event.date).format(i18n.date_format.toUpperCase()));    
        } 
    }).on('hide', function(event) {
        //console.log('hide', event.date);
        if(event.date !== undefined ) {
            localStorage.setItem(END_DATE , moment(event.date).format('YYYY-MM-DD'));
            //console.log('end date '+moment(event.date).format(i18n.date_format.toUpperCase()));
            $('#booking_start').datepicker('setStartDate', moment(event.date).subtract(1, 'M').format(i18n.date_format.toUpperCase()));
            $('#booking_start').datepicker('setEndDate', moment(event.date).format(i18n.date_format.toUpperCase()));    
        } else {
            $('#booking_start').datepicker('setStartDate', -Infinity);
            $('#booking_start').datepicker('setEndDate', Infinity); 
        }
    })

    $(document).on('range', '#booking_range', function(event, data) {
        let periodMap = {
            'Today':'day',
            'Yesterday':'day',
            'Last 7 Days':'week',
            'Last 14 Days':'2weeks',
            'Last 30 Days':'4weeks',
            'Last 30 Days':'4weeks',
            'This Month': 'month',
            'Last Month': 'month',
        };

        localStorage.setItem(STORE_PERIOD_SLUG, periodMap[data.period]||'day');
    })
    $('#booking_apply').on('click',function(){
         setFilters();
         //filter();
    });
    $('#booking_reset').on('click',function(){
        $('.filter').first().trigger('reset');
        $('.filter').find('.typeahead a').removeAttr('href');
        $('.filter').find('.typeahead input[type="hidden"]').val('');
        $('#booking_start').datepicker('update',moment().format(i18n.date_format.toUpperCase()));
        $('#booking_end').datepicker('update',moment().format(i18n.date_format.toUpperCase()));
    
        filter();
    });

    /*$('#startDateSelectDatepicker').datepicker({
        dateFormat: 'dd.mm.yyyy',
        defaultDate: 2,
        onSelect: date => {
            localStorage.setItem(STORE_START_DATE, date);
            initAll();
        }
    });

    $('#startDateSelectDatepicker').datepicker('setDate', today);
    */
    // get first element of the dropdown and set it as default
    //updatePeriodDropdown();
    //initAll();
    readFilters();
    
    //clock-line    
    moveClockLine();
    setInterval(moveClockLine, (60*1000));
   
    $('[data-period]').on('click', event => {
        let periodSlug =  $(event.currentTarget).data('period');
        
        if(periodSlug == 'today') {
            periodSlug = 'day';
            localStorage.setItem(STORE_START_DATE, moment().format('YYYY-MM-DD'));    
        }
        if(periodSlug == 'month') {
            var startDate = localStorage.getItem(STORE_START_DATE);
            startDate = moment(startDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
            localStorage.setItem(STORE_START_DATE, startDate);
        }

        localStorage.setItem(STORE_PERIOD_SLUG, periodSlug);
        localStorage.setItem(TIMERANGE, JSON.stringify({"from":0, "to":24}));
        $('#timePeriodSelectDropdown').prop('disabled', periodSlug=='day'?false:true);
        

        var startDate = localStorage.getItem(STORE_START_DATE);
        var end = updateEndDate(startDate, periodSlug);
        if(startDate) {
            $('#booking_start').datepicker('update', moment(startDate).format(i18n.date_format.toUpperCase()));    
        }

        if(end) {
            $('#booking_end').datepicker('update',moment(end).format(i18n.date_format.toUpperCase()));     
        }
        updateDateButton();
        updatePeriodDropdown();
        filter();
        //initAll();
        //setFilters();
    });
    $('[data-time-period]').on('click', event => {
        localStorage.setItem(TIMERANGE, JSON.stringify($(event.currentTarget).data('time-period')));
        $(`[data-time-period].active`).removeClass('active');
        $(event.currentTarget).addClass('active');
        $('#timePeriodSelectDropdown').text($(event.currentTarget).text());
        filter();
        //initAll();
    });

    $('[data-change-period]').on('click', event => {
        
        const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG); 
        
        const startDate = localStorage.getItem(STORE_START_DATE);
        const changeTo = $(event.currentTarget).data('change-period');
        switch (periodSlug) {
            case 'month':
                new_date = moment(startDate, 'YYYY-MM-DD').add(1, 'M').format('YYYY-MM-DD');
                if(changeTo=='prev') {
                    new_date = moment(startDate, 'YYYY-MM-DD').subtract(1, 'M').format('YYYY-MM-DD');
                }
                break;
            case '4weeks':
                new_date = moment(startDate, 'YYYY-MM-DD').add(4, 'w').format('YYYY-MM-DD');
                if(changeTo=='prev') {
                    new_date = moment(startDate, 'YYYY-MM-DD').subtract(4, 'w').format('YYYY-MM-DD');
                }
                break;
            case '3weeks':
                new_date = moment(startDate, 'YYYY-MM-DD').add(3, 'w').format('YYYY-MM-DD');
                if(changeTo=='prev') {
                   new_date = moment(startDate, 'YYYY-MM-DD').subtract(3, 'w').format('YYYY-MM-DD');
                }
                break;
            case '2weeks':
                new_date = moment(startDate, 'YYYY-MM-DD').add(2, 'w').format('YYYY-MM-DD');
                if(changeTo=='prev') {
                   new_date = moment(startDate, 'YYYY-MM-DD').subtract(2, 'w').format('YYYY-MM-DD');
                }
                break;
            case 'week':
                new_date = moment(startDate, 'YYYY-MM-DD').add(7, 'd').format('YYYY-MM-DD');
                if(changeTo=='prev') {
                   new_date = moment(startDate, 'YYYY-MM-DD').subtract(7, 'd').format('YYYY-MM-DD');
                }
                break;
            case 'day':
                new_date = moment(startDate, 'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD');
                if(changeTo=='prev') {
                   new_date = moment(startDate, 'YYYY-MM-DD').subtract(1, 'd').format('YYYY-MM-DD');
                }
                break;
            default:
                new_date = startDate;
                break;
        }
        localStorage.setItem(STORE_START_DATE, new_date);
        var end = updateEndDate(new_date, periodSlug);
       
        //localStorage.setItem(STORE_START_DATE, new_date);
        $('#startDateSelectDatepicker').datepicker('setDate', new_date);
        
        if(new_date && end) {
            //update start date range
            $('#booking_start').datepicker('setStartDate', moment(end).subtract(1, 'M').format(i18n.date_format.toUpperCase()));
            $('#booking_start').datepicker('setEndDate', moment(end).format(i18n.date_format.toUpperCase()));    
            //update end date range
            $('#booking_end').datepicker('setStartDate', moment(new_date).format(i18n.date_format.toUpperCase()));
            $('#booking_end').datepicker('setEndDate', moment(new_date).add(1, 'M').format(i18n.date_format.toUpperCase()));
            // update dates
            $('#booking_start').datepicker('update', moment(new_date).format(i18n.date_format.toUpperCase()));    
            $('#booking_end').datepicker('update', moment(end).format(i18n.date_format.toUpperCase()));     
                        
        }else{
            if(new_date) {
                $('#booking_start').datepicker('update', moment(new_date).format(i18n.date_format.toUpperCase()));    
                $('#booking_end').datepicker('setStartDate', moment(new_date).format(i18n.date_format.toUpperCase()));
                $('#booking_end').datepicker('setEndDate', moment(new_date).add(1, 'M').format(i18n.date_format.toUpperCase()));
                
            }
        
            if(end) {
                $('#booking_end').datepicker('update', moment(end).format(i18n.date_format.toUpperCase()));     
                $('#booking_start').datepicker('setStartDate', moment(end).subtract(1, 'M').format(i18n.date_format.toUpperCase()));
                $('#booking_start').datepicker('setEndDate', moment(end).format(i18n.date_format.toUpperCase()));    
        
            }    
        }
        
        updateDateButton();
        filter();
        //updatePeriodDropdown();
        //initAll();
        //setFilters();
    });

    $(document).on('autocomplete_change', '#eventCalendar .ui-autocomplete-input', function(event, data){
        if(data.id) {

            section = $(this).closest('[data-section]').data('section'); 
            row = $(this).closest('.collapse');
            row.removeClass('show');
            link = false;
            sectionData = {};
            sunInfo = JSON.parse(localStorage.getItem(SUN_INFO));
            label = (data.extra_label?data.extra_label:data.value).toUpperCase();
            if(data.link) {
                link = '<a href="'+$(data.link).attr('href')+'#availability" target="_blank" >'+label+'</a>';
            }
            sectionData[section] = {'timelines':{}};
            sectionData[section]['timelines'][label] = {
                                "label": label.toUpperCase(),
                                "link":data.link||false,
                                "refreshFn":"refreshFnCallback",
                                "eventObject": data.id,
                                "disabledDays": data.disabledDays,
                                "disabledTime": [],
                                "sunInfo": sunInfo,
                                "delete":true,

            };
            
            if(!timelinesArray[section+'-'+label]) {
                return new Promise((resolve, reject) => {
                    initTimelines({'sections':sectionData}).then(() => {
                        $('.timeline__box', $('#'+section+'-'+label.replace(/\s/g, '-').replace(/[()]/g, '').toLowerCase())).each(function(index, box) {
                            boxDroppable($(this));    
                        })
                        resolve(true);
                    });
                
                    
                });
            }
        }
        
        
        //console.log(sectionData);
    })
});

function clearEvents() {
    $('.timeline__event').remove()
}

function populateEvents() {
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    const startDate = localStorage.getItem(STORE_START_DATE);
    const endDate = localStorage.getItem(END_DATE);
    let filters = localStorage.getItem(FILTERS);

    //return $.get(urls.reservations_get_timeline+'?start='+startDate+'&end='+endDate+filters).then(events_array => {
    return $.get(urls.reservations_get_timeline+filters).then(events_array => {
        for (const [sectionId, timelines] of Object.entries(events_array)) {
            for (const [timelineId, events] of Object.entries(timelines)) {
                const $timeline = $(`[data-section="${sectionId}"]`).find(`[data-timeline="${timelineId}"]`);
                const $boxes = $timeline.find('.timeline__box')

                events.forEach(event => {
                    
                    let status = event.status.replace(' ', '_');
                    let status_color = `style='background-color: ${status_colors[status].background} !important'`;
                    const start = event.start;
                    const startPercentage = getPercentageOfDay(start, true);
                    const end = event.end;
                    const endPercentage = getPercentageOfDay(end, true);
                    console.log('start date:'+start, 'end date:'+end);
                    console.log('start %:'+startPercentage, 'end %:'+endPercentage);
                    const $event = $(`
                        <div
                            ${status_color}
                            class="timeline__event timeline__event--dot period_${periodSlug} ${event.status.replace(' ', '_')}_status"
                            
                            data-event-start="${event.start}"
                            data-event-end="${event.end}"
                            data-event-id="${event.id}"
                            data-event-type="${sectionId}"
                            >
                            <svg width="100%" height="100%" viewBox="0 0 500 75" preserveAspectRatio="xMinYMid meet" style="background-color:transparent" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <text x="50" y="50" font-size="50" fill="black"> ${event.event_content}</text>
                            </svg>
                        </div>
                    `);
                    let eventPosLeft = undefined;
                    let eventWidth = 0;
                    let eventDisplay = false;

                    // https://getbootstrap.com/docs/4.2/components/popovers/#options
                    /*$event.popover({
                        placement: 'top',
                        //trigger: 'click', // doesn't work with draggable
                        title: '.',//event.name,
                        /*template: `<div class="popover" role="tooltip">
                            <div class="arrow"></div>
                            <div class="popover-info">${event.pop_up}</div>
                            <div class="popover-footer">
                        </div>`,*/
                      /*  template: `<div class="popover" role="tooltip">
                            <div class="arrow"></div>
                            <div class="popover-info">1213123123</div>
                            <div class="popover-footer">
                        </div>`,
                        
                    });*/

                    $boxes.each((i, box) => {
                        const boxTime = $(box).attr('data-event-start');
                        const boxLeft = $(box).position().left
                        const boxWidth = $(box).outerWidth();
                        const sameTime = moment(boxTime).isBetween(start, end, undefined, '[)')
                        const sameDay = moment(boxTime).isSame(start, 'day')
                        

                        if (periodSlug === 'day' && sameTime) {
                            eventPosLeft = eventPosLeft !== undefined ? eventPosLeft : boxLeft;
                            eventWidth = eventWidth + boxWidth;
                            eventDisplay = true;
                        }

                        //if (periodSlug !== 'day' && sameDay && !sameTime) {
                        if (periodSlug !== 'day' && sameDay) {
                            eventPosLeft = (boxWidth * i) + (boxWidth * startPercentage / 100);
                            //cross date
                            if(startPercentage > endPercentage) {
                                eventWidth = (boxWidth * endPercentage / 100);
                            }else{
                                eventWidth = (boxWidth * endPercentage / 100) - (boxWidth * startPercentage / 100);     
                            }
                            
                            eventDisplay = true;
                        }

                        /*if (periodSlug !== 'day' && (sameDay || sameTime)) {
                            console.log({'event':event.id,'sameTime':sameTime, 'sameDay':sameDay});
                            eventPosLeft = (boxWidth * i) + (boxWidth * startPercentage / 100);
                            eventWidth = (boxWidth * endPercentage / 100) - (boxWidth * startPercentage / 100);
                            eventDisplay = true;
                        }*/
                        if(eventDisplay) {
                            boxDroppable(box);    
                        }
                        
                    });

                    
                    if (periodSlug === 'day' && event.isEditAble && eventDisplay) { //drag only 'day' view 
                        $event.draggable({
                            helper: function() {
                                var $this = $(this),
                                    boxWidth = $('.timeline__box')[0].clientWidth*-1,
                                    helper = $('<div class="timeline__event ui-state-highlight ui-draggable ui-draggable-handle" style="width:1px;height:100%;"></div>').append($this.clone().css('left', boxWidth));
                                $this.css('opacity', .5);
                                return helper;
                            },
                            drag: function(event, ui) {
                                $(this).addClass('ui-state-highlight dragging');
                                //$event.popover('hide');
                                //$event.popover('disable');
                                $('.timeline__event').popover('hide');
                                $('.timeline__event').popover('disable');
                            },
                            stop: function(event, ui) {
                                //$('.timeline__event').popover('hide');
                                //$('.timeline__event').popover('enable');
                                //console.log('stop', event);
                                //$(this).removeClass('ui-state-highlight');
                                $(this).removeClass('ui-state-highlight').css('opacity', '');
                            },
                            //containment: $(this).parent().parent().parent(),
                            //containment: $('.').parent().parent(),
                            //axis: 'x',
                            cursor: 'move',
                            snap: '.timeline__box',
                            snapMode: 'inner',
                            distance: 20,
                            //helper: "clone",
                            // revert position if dropped on disabled
                            revert: function(event) {
                                if(event) {                                
                                    const [el] = event;
                                    const isBoxDisabled = $(el).data('event-disabled');
                                    return isBoxDisabled;
                                } else {
                                    return true;
                                }
                            },
                        }).mousedown(function(event){
                            $(this).draggable("option", "cursorAt", {
                                left: 1,//Math.floor(this.clientWidth / 2)-10,
                            }); 
                        });
                    }
                    
                    $event.css('left', eventPosLeft);
                    $event.css('width', eventWidth);
                    $event.css('background-color', status_colors[status].background+' !important');
                    $event.toggle(eventDisplay);
                    $event.click(function(e) {
                        $('.popover').popover('hide');
                        $(this).popover({
                             placement: 'top',
                            //trigger: 'click', // doesn't work with draggable
                            title: '.',//event.name,
                            template: `<div class="popover" role="tooltip">
                                <div class="arrow"></div>
                                <div class="popover-info">${flightStripTemplate(event.pop_up)}</div>
                                <div class="popover-footer">
                            </div>`,
                        });
                        
                        $(this).not('.dragging').popover('show');
                        //$('.popover:not(#'+$(this).attr('aria-describedby')+')').remove(); 
                        //$(this).popover('toggle');
                    });
                    $timeline.append($event);
                });
            }
        }
        $('.timeline__event').each(function(index, event) {
            
            if($(event).hasClass('ui-draggable')) {
                $(this).draggable({
                    containment: $(this).parent().parent().parent()
                });  
            }
              
        })
        
    });


}

function boxDroppable(box) {
    if(createdBox && createdBox.filter(box).length) {
        return;
    }
    createdBox = (createdBox || $()).add(box);
    
    $(box).droppable({
        over: function(event, ui) {
            //console.log(ui.draggable.data('event-start'));
            $(box).find('.timeline__box--time').show()
            //$(box).css('background',"green");
        },
        out: function(event, ui) {
            $(box).find('.timeline__box--time').hide()
            //$(box).css('background',"");
        },
        drop: function(event, ui) {  
            $(box).find('.timeline__box--time').hide();
            let boxWidth = $('.timeline__box')[0].clientWidth,
                movePosition = ui.draggable.data().uiDraggable.position;
            ui.draggable.animate({'top':movePosition.top, 'left':(movePosition.left-boxWidth)});
           
            let timelineFromLabel = ui.draggable[0].parentElement.dataset.timeline; 
            let timelineToLabel = $(event.target)[0].parentElement.dataset.timeline;
            const timelineSection = timelineFromLabel.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase();
            const boxDate = $(event.target).data('event-start');
            const eventId = ui.draggable.data('event-id');
            const objectId = $(event.target).data('event-object');
            const eventType = ui.draggable.data('event-type');
            const eventStart = moment(ui.draggable.data('event-start'));
            const eventEnd = moment(ui.draggable.data('event-end'));
           
            setTimeout(function(e){
                if($(ui.draggable) && $(ui.draggable).hasClass('dragging')) {
                    $(ui.draggable).removeClass('dragging');
                }    
            }, 1000);
            
            //#315 
            if(moment(boxDate).format('HH:mm') == moment(eventStart).format('HH:mm') && timelineFromLabel == timelineToLabel) {
                $('.timeline__event').popover('enable');
                $('.timeline__event').popover('hide');
                return;
            }

            Swal.fire({
                title: "Do you confirm the change?",
                text: `Time changed from ${(timelineFromLabel != timelineToLabel?timelineFromLabel:'')} ${moment(eventStart).format('HH:mm')} - ${moment(eventEnd).format('HH:mm')} to ${(timelineFromLabel != timelineToLabel?timelineToLabel:'')} ${moment(boxDate).format('HH:mm')}-${moment(moment(boxDate)+(eventEnd-eventStart)).format('HH:mm')}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            }).then(function(result) {
                $('.timeline__event').popover('enable');
                $('.timeline__event').popover('hide');
                if (result.value) {
                    sendQeury(urls.booking_update+'/'+eventId, {'objType':eventType,'objectId':objectId, 'taskFrom':moment(boxDate).format('YYYY-MM-DD HH:mm')}).done(function(result){
                        if(result.errors) {
                            //alert(result.error); 
                           // $(ui.draggable).removeClass('ui-state-highlight').css('opacity', '');
                            ui.draggable.animate(ui.draggable.data().uiDraggable.originalPosition,"slow");
                             Swal.fire(
                                 "Booking not updated!",
                                 "<div>"+result.errors+"</div>",
                                 "error"
                             )
                            //sysMsg.show({title: "Booking not updated!", body: "<div>"+result.errors+"</div>"})
                            
                            return;
                        } else {
                            localStorage.setItem(SCROLLTO, timelineSection);
                            initAll();
                            Swal.fire(
                                "Booking updated!",
                                "Successfully moved event to "+moment(boxDate).format('YYYY-MM-DD HH:mm'),
                                "success"
                            )
                            return;
                            //sysMsg.show({'title': 'Bookinig update', 'severity':'success', 'body':'Success update event for '+moment(tmp).format('YYYY-MM-DD HH:mm')});
                        }
                    });
                } else {
                    //$(ui.draggable).removeClass('ui-state-highlight').css('opacity', '');
                    ui.draggable.animate(ui.draggable.data().uiDraggable.originalPosition,"slow");
                    return;
                }
            });
        },
    });
}

/**
 * Call on init and on period change
 *
 * @param {'day'|'week'|'2weeks'|'3weeks'|'4weeks'|'month'} periodSlug
 */
function updatePeriodDropdown() {
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    const $electedPeriod = $(`[data-period="${periodSlug}"]`);
    const selectedPeriodLabel = $electedPeriod.text();
    $(`[data-period].active`).removeClass('active');
    $electedPeriod.addClass('active');
    $('#periodSelectDropdown').text(selectedPeriodLabel);
}

function prepareTimelineIntervals() {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    const startDate = localStorage.getItem(STORE_START_DATE);
    var timeRange = localStorage.getItem(TIMERANGE);
    let intervals = 0;
    let result = [];
    // let res = {
    //     date: null,         // full date in format 'YYYY-MM-DD HH:mm:ss'
    //     label: null,        // label above the timeline
    //     weekend: false,     // is a weekend
    //     workingHours: true, // is working hours in case of day view
    //     disabled: false,    // is the inerval is disabled
    // };

    switch(periodSlug) {
        case 'month':
            const startOfMonth = moment(startDate);
            intervals = moment(startDate).daysInMonth();

            for (let i = 0; i < intervals; i++) {
                let current = startOfMonth.startOf('month').add(1 * i, 'day');
                result.push({
                    date: current.format(format),
                    label: current.format('DD'),
                    weekend: current.isoWeekday() === 6 || current.isoWeekday() === 7,
                    workingHours: null,
                    disabled: false,
                });
            }
            return result;
        case '4weeks':
            intervals = 28;
            result = [];
            for (let i = 0; i < intervals; i++) {
                let current = moment(startDate, 'YYYY-MM-DD').add(1 * i, 'day');
                result.push({
                    date: current.format(format),
                    label: current.format('ddd DD'),
                    weekend: current.isoWeekday() === 6 || current.isoWeekday() === 7,
                    workingHours: null,
                    disabled: false,
                });
            }
            return result;
        case '3weeks':
            intervals = 21;
            result = [];
            for (let i = 0; i < intervals; i++) {
                let current = moment(startDate, 'YYYY-MM-DD').add(1 * i, 'day');
                result.push({
                    date: current.format(format),
                    label: current.format('ddd DD'),
                    weekend: current.isoWeekday() === 6 || current.isoWeekday() === 7,
                    workingHours: null,
                    disabled: false,
                });
            }
            return result;
        case '2weeks':
            intervals = 14;
            result = [];
            for (let i = 0; i < intervals; i++) {
                let current = moment(startDate, 'YYYY-MM-DD').add(1 * i, 'day');
                result.push({
                    date: current.format(format),
                    label: current.format('ddd DD'),
                    weekend: current.isoWeekday() === 6 || current.isoWeekday() === 7,
                    workingHours: null,
                    disabled: false,
                });
            }
            return result;
        case 'week':
            intervals = 7;
            result = [];
            for (let i = 0; i < intervals; i++) {
                let current = moment(startDate, 'YYYY-MM-DD').add(1 * i, 'day');
                result.push({
                    date: current.format(format),
                    label: current.format('ddd DD'),
                    weekend: current.isoWeekday() === 6 || current.isoWeekday() === 7,
                    workingHours: null,
                    disabled: false,
                });
            }
            return result;
        case 'day':
        default:
            let intevalStart = 0;
            intervals = (24 * 60) / 15;
            
            if(timeRange != "undefined") {
                range = JSON.parse(timeRange);
                intevalStart = (range.from *60) / 15; 
                intervals = (range.to * 60) / 15;
            }
            /* discus 
                interval range 07-20
                intervals = (20 * 60) / 15;
                for (let i = ((7*60)/15);i < intervals; i++)
            */

            
            result = [];
            for (let i = intevalStart; i < intervals; i++) {
                let current = moment(startDate, 'YYYY-MM-DD').add(15 * i, 'minutes');
                let showLabel = +current.format('m') === 0;
                result.push({
                    date: current.format(format),
                    label: showLabel ? current.format('HH') : null,
                    weekend: false, //to discuss it current.isoWeekday() === 6 || current.isoWeekday() === 7,
                    workingHours: null,
                    disabled: false,
                });
            }
            return result;
    }
}

/**
 * Init all on first load
 * @param {*} data
 */
function initAll() {
    // TODO: make http request with params: `periodSlug`, `startDate`, `filters`, etc.
    $('.popover').remove();
    //const data = $.get('./demo.json');
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    var startDate = localStorage.getItem(STORE_START_DATE);
    var endDate = localStorage.getItem(END_DATE);
    let filters = localStorage.getItem(FILTERS);
    //console.log(filters);

    timelinesArray = {};


    //const data = $.get(urls.reservations_get_sections+'?start='+startDate+'&end='+end+filters);
    const data = $.get(urls.reservations_get_sections+filters);
    history.pushState({}, null, urls.timeline_list+'?start='+startDate+'&end='+endDate);
    $('#eventCalendar').text('Loading...');
    

    return Promise.resolve(data)
        .then(data => initSections(data))
        .then(data => initTimelines(data))
        .then(() => loading(true))
        .then(() => initTimelineEvents())
        .then(() => loading())  
        .then(() => scrollTo());
}

function scrollTo() {
    let element = localStorage.getItem(SCROLLTO);

    if(element != "" && element != null && $("#"+element).length > 0) {
         
         $([document.documentElement, document.body]).animate({
             scrollTop: $("#"+element).offset().top
        }, 1000);

        localStorage.setItem(SCROLLTO, '');
    }
}

function loading(show = false) {
    if(show){
        $('.ajax_loading_mask').show();
    }else{
        $('.ajax_loading_mask').hide();
    }
}

/**
 * Init Sections
 * @param {*} data
 */
function initSections(data) {
    $('#eventCalendar').text('');
    //console.group(`%c INIT SECTIONS`, 'color:green');
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    localStorage.setItem(SUN_INFO, JSON.stringify(data.settings.sunInfo));
    //clock line
    clockLine();
    /*
    console.group('sun info');
        console.log('civil twilight begin: '+moment(data.settings.sunInfo.civil_twilight_begin*1000).utc().format('HH:mm'));
        console.log('sunrise: '+moment(data.settings.sunInfo.sunrise*1000).utc().format('HH:mm'));
        console.log('sunset: '+moment(data.settings.sunInfo.sunset*1000).utc().format('HH:mm'));
        console.log('civil twilight end: '+moment(data.settings.sunInfo.civil_twilight_end*1000).utc().format('HH:mm'));
    console.groupEnd();
   */
    return new Promise((resolve, reject) => {
        for (const [key, section] of Object.entries(data.sections)) {
            
            const $section = $(`<div class="container-fluid mb-5" data-section="${key}"></div>`);
            const $header = $('<div class="row mb-5"></div>');
            const $title = $(`<div class="timeline-head align-items-center col-lg-3 mx-auto  d-flex"><span>${section.label}</span> ${typeof form !== 'undefined' ?'<button class="btn btn-primary btn-sm ml-2" type="button" data-toggle="collapse" data-target="#form_'+key+'" >+</button></div>':''}`);
            
            if(typeof form !== 'undefined') {
                var filters_section_input = JSON.parse($('input:first', $(form[key])).attr('data-filters'));
                
                filters_section_input.start = localStorage.getItem(STORE_START_DATE);
                filters_section_input.end = localStorage.getItem(END_DATE);
                $title.append('<div class="collapse col-lg-9" id="form_'+key+'">'+form[key]+'</div>');
                
            }
            //$autocomplere_field = $(`<div class="collapse col-lg-3" id="form_'+key+'">'+form[key]+'</div>`) 
            
            $header.append($title);
            $header.append('');
            $section.append($header);
            
            //$section.append(`<div class="head-label">${section.label}</div>`);
            $('#eventCalendar').append($section);
            if(typeof form !== 'undefined'){
                $('#'+$('input:first', $(form[key])).attr('id')).attr('data-filters', JSON.stringify(filters_section_input)).prop('disabled', periodSlug !== 'day'||false);
            }
            $('#form_'+key).on('show.bs.collapse', function () {
                $(this).find('input').val("");
                //$(this).find('input');    
            })
            
            $('#form_'+key).on('shown.bs.collapse', function () {
                $(this).find('input').focus();
            })
            //console.info(`Section ${section.label} render completed`);
        } 

        //console.groupEnd();

        resolve(data);
    });
}

/**
 * Init Timelines
 * @param {*} data
 */
function initTimelines(data) {
    //console.log(data);
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    const sunInfo = JSON.parse(localStorage.getItem(SUN_INFO));
    const startDate = localStorage.getItem(STORE_START_DATE);
    //console.group(`%c INIT TIMELINES`, 'color:green');
    return new Promise((resolve, reject) => {
        const timelineIntervals = prepareTimelineIntervals();

        for (const [sectionId, section] of Object.entries(data.sections)) {
            const $section = $(`[data-section="${sectionId}"]`);

            for (const [timelineId, timeline] of Object.entries(section.timelines)) {
                var timelinesArrayKey = sectionId+'-'+timeline.label;
                timelinesArray[timelinesArrayKey]=timelinesArrayKey;
                let timelineItems = '';
                var sunInfoPercentage = {};
                $.each(sunInfo, function(index, value){
                    sunInfoPercentage[index] = getPercentageOfPeriod(moment(value*1000).utc(), index);
                })

                //console.log(sunInfoPercentage);
                availableColor = timeline_colors.available?timeline_colors.available:'#F2F2F2';
                let timelineStyle = `style="background: linear-gradient(to right,`; 
                        if(sunInfoPercentage.civil_twilight_begin > 0) {
                            timelineStyle +=`#757170 0% ${sunInfoPercentage.civil_twilight_begin}%,`;
                        }
                        if(sunInfoPercentage.civil_twilight_begin == 0 && sunInfoPercentage.sunrise > 0) {
                            timelineStyle +=`${availableColor} 0% ${sunInfoPercentage.sunrise}%,`;
                        }
                        if(sunInfoPercentage.civil_twilight_begin > 0 && sunInfoPercentage.sunrise > 0) {
                            timelineStyle +=`#ABA7A6 ${sunInfoPercentage.civil_twilight_begin}% ${sunInfoPercentage.sunrise}%,`;
                        }
                        if(sunInfoPercentage.sunrise == 0 && sunInfoPercentage.sunset > 0) {
                            timelineStyle +=`${availableColor} 0% ${sunInfoPercentage.sunset}%,`;
                        }
                        if(sunInfoPercentage.sunrise > 0 && sunInfoPercentage.sunset > 0) {
                            timelineStyle +=`${availableColor} ${sunInfoPercentage.sunrise}% ${sunInfoPercentage.sunset}%,`;
                        }
                        if(sunInfoPercentage.sunset>0 && sunInfoPercentage.civil_twilight_end > 0) {
                            timelineStyle +=`#ABA7A6 ${sunInfoPercentage.sunset}% ${sunInfoPercentage.civil_twilight_end}%,`;
                        }
                        if(sunInfoPercentage.civil_twilight_end > 0 ) {
                            timelineStyle +=`#757170 ${sunInfoPercentage.civil_twilight_end}% 100%`;
                        }
                        timelineStyle +=`)"`;
                sameDayDisabled = [];
                timelineIntervals.forEach((interval,  index)=> {
                    const _tmp = interval.date.split(':');
                    let isDisabled = false;
                    let disabledStyle = '';               
                    const isRoundHour = _tmp[_tmp.length - 2] === '00'; // minutes
                    sameDay = [];
                    timeline.disabledDays.forEach(disabledDay => {
                        let from = (periodSlug=='day')?moment(disabledDay.from):moment(disabledDay.from).clone().startOf('day'),
                            to = (periodSlug=='day')?moment(disabledDay.to):moment(disabledDay.to).endOf('day');
                        
                        isDisabled = isDisabled || moment(interval.date).isBetween(
                                from,
                                to,
                                'millisecond',
                                '[)'
                                );
                        
                        if(isDisabled) {
                            disabledColor = 'red';
                           
                            if(disabledDay.availability ){
                                disabledColor = timeline_colors.unavailable?timeline_colors.unavailable:disabledColor;
                            }
                            
                            if(disabledDay.flight || disabledDay.booking){
                                disabledColor = timeline_colors.in_another_flight?timeline_colors.in_another_flight:disabledColor;
                            }

                            if(periodSlug!='day') {
                                if(moment(interval.date).isSame(moment(disabledDay.from).clone().startOf('day'))
                                    && moment(interval.date).isSame(moment(disabledDay.to).clone().startOf('day'))
                                ){
                                        sameDay.push(disabledDay);
                                }else{
                                    if(moment(interval.date).isSame(from)) {
                                        disabledStyle =`style="background:  linear-gradient(to right, transparent ${getPercentageOfDay(disabledDay.from, true)}%, ${disabledColor} ${getPercentageOfDay(disabledDay.from, true)}%);"`
                                    }

                                    if(moment(interval.date).isSame(moment(disabledDay.to).clone().startOf('day'))) {
                                       disabledStyle =`style="background:  linear-gradient(to left, transparent ${getPercentageOfDay(disabledDay.to, true)}%, ${disabledColor} ${getPercentageOfDay(disabledDay.to, true)}%);"`
                                    }

                                    if(moment(from).isSame(to, 'day') && moment(interval.date).isSame(moment(disabledDay.from).clone().startOf('day'))) {
                                       disabledStyle =`style="background:  linear-gradient(to right, transparent ${getPercentageOfDay(disabledDay.from, true)}%,  ${disabledColor} ${getPercentageOfDay(disabledDay.from, true)}%  ${getPercentageOfDay(disabledDay.to, true)}%, transparent ${getPercentageOfDay(disabledDay.to, true)}%);"`
                                    }

                                    if(moment(interval.date).isSame(from) && moment(interval.date).isSame(moment(disabledDay.to).clone().startOf('day'))) {
                                       disabledStyle =`style="background:  linear-gradient(to right,  ${disabledColor} ${getPercentageOfDay(disabledDay.from, true)}% ${getPercentageOfDay(disabledDay.to, true)}%, transparent  ${getPercentageOfDay(disabledDay.to, true)}%);"`
                                    }
    
                                }         
                            } else {
                                   disabledStyle =`style="background: ${disabledColor} ;"`
                                
                            }
                        }
                    })  
                    
                    if(sameDay.length > 0) {
                        
                        disabledStyle =`style="background:  linear-gradient(to right`;
                        
                        sameDay.forEach((disabledDay, index )=> {
                            if(disabledDay.availability ){
                                disabledColor = timeline_colors.unavailable?timeline_colors.unavailable:disabledColor;
                            }
                        
                            if(disabledDay.flight || disabledDay.booking){
                                disabledColor = timeline_colors.in_another_flight?timeline_colors.in_another_flight:disabledColor;
                            }

                            let from = moment(disabledDay.from),
                                to = moment(disabledDay.to);
                            
                            if(!from.isSame(moment(from).clone().format('YYYY-MM-DD 00:00:00'))){
                                disabledStyle +=`, transparent 0% ${getPercentageOfDay(disabledDay.from, true)}% `;      
                            } 
                            
                            disabledStyle +=`, ${disabledColor} ${getPercentageOfDay(disabledDay.from, true)}% ${getPercentageOfDay(disabledDay.to, true)}% `;
                            if(sameDay.length == parseInt(index+1) && getPercentageOfDay(disabledDay.to, true) < 100) {
                                disabledStyle +=`, transparent ${getPercentageOfDay(disabledDay.to, true)}% 100% `;    
                            }
                                  
                               
                        })   
                        disabledStyle +=`)"`;

                    }
                    //console.log(isDisabled);   
                    //console.groupEnd();
                    // setup interval boxes
                    
                    timelineItems += `
                        <div
                            class="
                                flex-fill
                                timeline__box
                                ${ interval.weekend ? 'timeline__box--weekend' : ''}
                                ${ isRoundHour ? 'timeline__box--round-hour' : '' }
                                ${ isDisabled ? 'timeline__box--disabled' : '' }
                                
                            "
                            ${disabledStyle}
                            data-event-disabled="${isDisabled}"
                            data-event-start="${interval.date}"
                            data-event-object="${timeline.eventObject}"
                            data-event-type="${sectionId}" 
                            onclick="clickOnTimeline(this)"
                        >
                            <span class="timeline__box--time d-none">${interval.date}</span>
                            ${ interval.label
                                ? `<div class="timeline__box-label">${interval.label}</div>`
                                : ``
                            }
                        </div>
                    `;
                });

                //console.info(`Timeline ${timeline.label} render completed`);
                const $row = $(`
                    <div class="d-flex align-items-center mb-2 position-relative" id="${sectionId+'-'+timelineId.replace(/\s/g, '-').replace(/[()]/g, '').toLowerCase()}" data-timeline>
                        <div class="timeline__label" title="${timeline.label}">${timeline.link?timeline.link:timeline.label}</div>
                        <div
                            class="flex-fill timeline timeline__period--${periodSlug} d-flex align-items-stretch"
                            data-timeline="${timelineId}"
                            ${periodSlug == 'day'?timelineStyle:''}
                        >
                            
                            ${timelineItems}
                        </div>
                        ${timeline.delete?'<div class="removeTimeline">X</div>':''}
                    </div>
                `);

                $section.append($row);

                $row.find('.timeline__event').each((_, item) => {
                    let l = 0; // event box length in boxes

                    $row.find('.timeline__box').each((__, box) => {
                        const itemStartDate = item.dataset.startDate;
                        const itemEndDate = item.dataset.endDate;
                        const boxDate = box.dataset.startDate;
                        const isBetween = moment(boxDate).isBetween(
                            moment(itemStartDate),
                            moment(itemEndDate),
                            undefined,
                            '[)'
                        );

                        // console.group(boxDate);
                        /*
                        if (isBetween) {
                            l += box.clientWidth
                            // console.log(`%c isBetween`, 'color:green');
                        } else {
                            // console.log(`%c notBetween`, 'color:red');
                        }*/

                        // console.log(`${itemStartDate} > ${boxDate} < ${itemEndDate}`);
                        // console.groupEnd();
                    });
                    $(item).width(l);
                });
                $('.removeTimeline', $row).click(function(){
                    delete timelinesArray[timelinesArrayKey];
                    //console.log('asd');
                    $row.remove();
                })

            }
        }

        //console.groupEnd();
        moveClockLine(); 
        resolve(data);
    });
}

/**
 * Init Timeline Events
 * @param {*} data
 */
function initTimelineEvents() {
    return new Promise((resolve, reject) => {
//        console.group(`%c INIT TIMELINE EVENTS`, 'color:green');

        populateEvents()
            .then(() => {
               // console.groupEnd();
                resolve(true);
            });

        // for (const [key, section] of Object.entries(data)) {
        //     console.log(key, section);
        //     // section.timelines.forEach(timeline => {
        //     //     console.log(timeline);
        //     // });
        // }


    });
}

/**
 * Init Timeline Events
 * @param {*} data
 */
function clearTimelineEvents(data) {
    return new Promise((resolve, reject) => {
        // console.log(s);

        resolve(data);
    });
}

/**
 * Init Timeline Events
 * @param {*} data
 */
function updateTimelineEvents(data) {
    return new Promise((resolve, reject) => {
        // console.log(s);

        resolve(data);
    });
}


function clickOnEvent(element) {
    //$('.popover').not(element).popover('hide');
}

function clickOnTimeline(element) {
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    const { eventStart, eventDisabled, eventObject, eventType  } = element.dataset;
    
    if (periodSlug !='day') {
        localStorage.setItem(STORE_START_DATE, eventStart);
        //localStorage.setItem(STORE_PERIOD_SLUG, 'day');
       // updateEndDate(eventStart, 'day');
        //$('#startDateSelectDatepicker').datepicker('setDate',  new Date(eventStart));
        $('[data-period="day"]').trigger('click');
        return false;
    }
    const { timeline } = element.parentElement.dataset;
    const isDisabled = JSON.parse(eventDisabled);
    if (isDisabled) {
        return;
    }
    const q = {'start': eventStart};
    q[eventType] = eventObject;
    const querystring = $.param(q);

    window.open(urls.booking_add+'?'+querystring);
    //console.log(`do something with eventStart '${eventStart}' and timeline '${timeline}'`);
}



function updateDateButton() {
    const periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    const startDate = localStorage.getItem(STORE_START_DATE);
    let startDateButtonText = '';
    switch (periodSlug) {
        case 'month':
            startDateButtonText = moment(startDate, 'YYYY-MM-DD').format('MMM YYYY');
        break;
        case '4weeks':
            startDateButtonText = `
                ${moment(startDate, 'YYYY-MM-DD').format('DD MMM')} -
                ${moment(startDate, 'YYYY-MM-DD').add(4, 'w').format('DD MMM')}
                ${moment(startDate, 'YYYY-MM-DD').format('YYYY')}
            `;
        break;
        case '3weeks':
            startDateButtonText = `
                ${moment(startDate, 'YYYY-MM-DD').format('DD MMM')} -
                ${moment(startDate, 'YYYY-MM-DD').add(3, 'w').format('DD MMM')}
                ${moment(startDate, 'YYYY-MM-DD').format('YYYY')}
            `;
        break;
        case '2weeks':
            startDateButtonText = `
                ${moment(startDate, 'YYYY-MM-DD').format('DD MMM')} -
                ${moment(startDate, 'YYYY-MM-DD').add(2, 'w').format('DD MMM')}
                ${moment(startDate, 'YYYY-MM-DD').format('YYYY')}
            `;
        break;
        case 'week':
            startDateButtonText = `
                ${moment(startDate, 'YYYY-MM-DD').format('DD MMM')} -
                ${moment(startDate, 'YYYY-MM-DD').add(7, 'd').format('DD MMM')}
                ${moment(startDate, 'YYYY-MM-DD').format('YYYY')}
            `;
        break;
        case 'day':
        default:
            startDateButtonText = moment(startDate, 'YYYY-MM-DD').format('dddd, MMMM DD, YYYY');
        break;
    }

    $('#current-period').text(startDateButtonText);
    //setFilters();
}
function getTimelineColor(event) {
    //console.log(timeline);
    return '';
}

function getPercentageOfDay(date, event = false) {
        if(event){
            return Math.round((moment(date).hour() / 24 + moment(date).minute() / (60 * 24)) * 100);     

        }else {
            return Math.round((moment(date).utc().hour() / 24 + moment(date).utc().minute() / (60 * 24)) * 100);
        }
        //return Math.round((moment(date).hour() / interval + moment(date).minute() / (60 * interval)) * 100);     
}
/**
 * calculate percentage of 
*/
function getPercentageOfPeriod(date, label) {
    periodSlug = localStorage.getItem(STORE_PERIOD_SLUG);
    if(periodSlug != 'day') {
        return 0;    
    }

    let timeRange = JSON.parse(localStorage.getItem(TIMERANGE));
    
    var from = moment(date).utcOffset(0);
    from.set({hour:parseInt(timeRange.from),minute:0,second:0,millisecond:0});
    
    var to = moment(date).utcOffset(0);
    to.set({hour:parseInt(timeRange.to),minute:0,second:0,millisecond:0});
    
    var interval = parseInt(to.valueOf()) - parseInt(from.valueOf()); 
    
    if(moment(date).utc().isBetween(from, to, 'millisecond','[)')) {
        return Math.round(((date.valueOf()-from.valueOf())/interval)*100);
        //return Math.round((moment(date).hour() / interval + moment(b).minute() / (60 * interval)) * 100);
    }else{
        
        return 0;
    }
}

function clockLine() {

    sun_info = JSON.parse(localStorage.getItem(SUN_INFO));  
    $.each(sun_info, function(index, val){
        sun_time = moment(val*1000).utc();
        
        let move = getPercentageOfPeriod(sun_time, index);  
        if(move > 0){
            $('.'+index).show();
        
            $('.'+index+' > span').text(sun_time.format('HH:mm'));
            $('.'+index).animate({'left':move+'%'});        
        }else{
            $('.'+index).hide();    
        }
    })

}

function moveClockLine() {
    let move_utc = getPercentageOfPeriod(moment().utc(), 'utc');
     //FMSKAB-383
    if(move_utc > 0 && moment().format('YYYY-MM-DD') == moment(localStorage.getItem(STORE_START_DATE)).format('YYYY-MM-DD')) {
        $('.clock-line-utc').show();
        $('.clock-line-utc > span').text(moment().utc().format('HH:mm')+' UTC / '+moment().format('HH:mm')+' LT');
        $('.clock-line-utc').animate({'left':move_utc+'%'});       
    }else{
        
        $('.clock-line-utc').hide();
    }
    
} 

function setFilters() {
    var startDate = localStorage.getItem(STORE_START_DATE);
    
    var end = !localStorage.getItem(END_DATE)?updateEndDate(startDate, periodSlug):localStorage.getItem(END_DATE);
    
    if(startDate) {
        $('#booking_start').datepicker('update', moment(startDate).format(i18n.date_format.toUpperCase()));    
    }
    
    if(end) {
        $('#booking_end').datepicker('update',moment(end).format(i18n.date_format.toUpperCase()));     
    }
    if(startDate && end) {
        setPeriod();
    }
    //clock line
    //$('.clock-line').show();

    //update period button
    //updatePeriodDropdown();
    // Update datepicker button
    updateDateButton();
    filter();
}

function updateEndDate(startDate, periodSlug) {
    
    switch (periodSlug) {
        case 'month':
            end = moment(startDate, 'YYYY-MM-DD').add(1, 'M').format('YYYY-MM-DD');
            $('#booking_start').datepicker('update', moment(startDate).format(i18n.date_format.toUpperCase()));    
        break;
        case '4weeks':
            end = moment(startDate, 'YYYY-MM-DD').add(4, 'w').format('YYYY-MM-DD');
        break;
        case '3weeks':
           end = moment(startDate, 'YYYY-MM-DD').add(3, 'w').format('YYYY-MM-DD');
        break;
        case '2weeks':
            end = moment(startDate, 'YYYY-MM-DD').add(2, 'w').format('YYYY-MM-DD');
        break;
        case 'week':
            end = moment(startDate, 'YYYY-MM-DD').add(7, 'd').format('YYYY-MM-DD');
        break;
        case 'day':
        default:
            end = startDate;
        break;
    }
    localStorage.setItem(END_DATE, end);
    return end;
}

function setPeriod() {

        var s = moment($('#booking_start').datepicker('getDate'));
        var e = moment($('#booking_end').datepicker('getDate'));

        var diff = e.diff(s,'days');
        //var diff = (e-s)/(24*60*60*1000);
        var periodSlug = 'day';
        if(diff<1){
            periodSlug = 'day';
        } else if(diff>1 && diff<8) {
            periodSlug = 'week';
        } else if(diff>7 && diff<15) {
            periodSlug = '2weeks';
            
        } else if(diff>14 && diff<22) {
            periodSlug = '3weeks';
            
        } else if(diff>21 && diff<28) {
            periodSlug = '4weeks';
        } else if(diff>=28) {
            periodSlug = 'month';
        }
        localStorage.setItem(STORE_PERIOD_SLUG, periodSlug);  
        updatePeriodDropdown();
}
function readFilters() {
    if(window.location.search){
        let search = location.search.substring(1);
        if(search){
            //filters = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            filters = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });

        }
        if(filters.start && moment(filters.start).isValid()) {
            $('#booking_start').val(moment(filters.start).format(i18n.date_format.toUpperCase()));
            //$('#booking_start').val(filters.start);
           // console.log(moment(filters.start));
            localStorage.setItem(STORE_START_DATE, moment(filters.start).format('YYYY-MM-DD')); 
           
        }
        if(filters.end  && moment(filters.end).isValid()) {
            $('#booking_end').val(moment(filters.end).format(i18n.date_format.toUpperCase()));
            //$('#booking_end').val(filters.end);
            localStorage.setItem(END_DATE, moment(filters.end).format('YYYY-MM-DD'));
            
        }
        //console.log(filters);
    }
    setFilters();
}

function filter() {
     var qparam ='',
        param = {
            'start': $('#booking_start').val() || null,
            'end': $('#booking_end').val() || null,
            'aircraft': $('#booking_aircraft').val() || null,
            'user': $('#booking_user').val() || null,
            'flightType': $('#booking_flightType').val() || null,
            'status': $('#booking_status').val() || null,
            'instructor': $('#booking_instructor').val() || null,
            'ground_instructor':$('#booking_ground_instructor').val() || null,
            'instructor_ground_instructor':$('#booking_instructor_ground_instructor').val() || null,
            'examiner': $('#booking_examiner').val() || null,
            'pic': $('#booking_pic').val() || null,
            'safety': $('#booking_safety').val() || null,
            'excercise':$('#booking_excercise').val() || null,
            'outsideWorkingTime': ~~$('#booking_outsideWorkingTime').is(':checked'),
        };

        for (var key in param) {
            if (param.hasOwnProperty(key) && param[key]===null) {
                delete param[key];
            }
        }
        if (Object.keys(param).length>0){
            qparam = '?'+$.param(param);
        }
        if (param['start']) {
            localStorage.setItem(STORE_START_DATE, moment($('#booking_start').datepicker('getDate')).format('YYYY-MM-DD'));
        }
        if (param['end']) {
        }
        if (param['start'] && param['end']) {
            var s = moment($('#booking_start').datepicker('getDate'));
            var e = moment($('#booking_end').datepicker('getDate'));
            setPeriod();
            localStorage.setItem(STORE_START_DATE, moment(s).format('YYYY-MM-DD'));
            localStorage.setItem(END_DATE, moment(e).format('YYYY-MM-DD'));
           
            //updatePeriodDropdown();
        }
        localStorage.setItem(FILTERS, qparam);
        initAll();
}
function parseToMs(datestring) {
    var date = datestring.split('.');
    return new Date(date[2],(date[1]-1),date[0]).getTime();
}

