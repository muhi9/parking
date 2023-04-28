function LoggerSelector(selector, url, options) {
    if (this===window) {
        return new LoggerSelector(selector, url, options);
    } else {
        this.element = $(selector+'_session');
        this.date = $(selector+'_date');
        this.url = url;
        this.options = $.extend(true, {}, this.options, options);
        this.init();
    }
}

LoggerSelector.prototype = {
    element: null,
    date: null,
    url: '',
    options: {
        times: {},
        aircraft: null,
    },
    selectors: {
        air: {
            from: {
                date: '#flightbundle_flight_takeoff',
                time: '#flightbundle_flight_takeoff_time',
            },
            to: {
                date: '#flightbundle_flight_landing_time',
                time: '#flightbundle_flight_landing_time_time',
            },
            tital: '#flightbundle_flight_airTime',
        },
        block: {
            from: {
                date: '#flightbundle_flight_blockOff',
                time: '#flightbundle_flight_blockOff_time',
            },
            to: {
                date: '#flightbundle_flight_blockOn',
                time: '#flightbundle_flight_blockOn_time',
            },
            tital: '#flightbundle_flight_blockTime',
        },
        engine: {
            from: {
                date: '#flightbundle_flight_startup',
                time: '#flightbundle_flight_startup_time',
            },
            to: {
                date: '#flightbundle_flight_shutdown',
                time: '#flightbundle_flight_shutdown_time',
            },
            tital: '#flightbundle_flight_engineTime',
        }
    },


    init: function() {
        var that = this;

        // change option
        this.element.change(function() {
            that.setTimes(that.options.times[that.element.val()]);
        });

        // load from server by date
        this.date.change(function() {
            var date = that.date.datepicker('getDate'),
                formatted = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).substr(-2)+'-'+('0'+date.getDate()).substr(-2),
                url;
            url = that.url
                .replace('__date__', formatted)
                .replace('__aircraft__', that.options.aircraft || '')
                .replace('__flight__', that.options.flight || '')
                .replace(/[\/\s]+$/, '');
            sendQeury(url).done(function(response) {
                var group, i, j;
                that.options.times = response.times;

                that.element.find('option:not(:first), optgroup').remove();
                for (i in response.choices) {
                    if (isNaN(response.choices[i])) {
                        group = $('<optgroup>').prop('label', i);
                        for (j in response.choices[i]) {
                            $('<option></option>').prop('value', response.choices[i][j]).html(j).appendTo(group);
                        }
                        group.appendTo(that.element);
                    } else {
                        $('<option></option>').prop('value', response.choices[i]).html(i).appendTo(that.element);
                    }
                }

                that.element.change();
            });
        })
    },


    setTimes(values) {
        var tmp, clk, i, j,
            wtf = ['engine', 'block', 'air'];
        if (values!==undefined) {
            for (j=0; j<wtf.length; j++) {
                i = wtf[j];
                if (values[i] && values[i].from) {
                    $(this.selectors[i].from.time).val(values[i].from.time);
                    $(this.selectors[i].from.date).datepicker('setDate', values[i].from.date);
                } else {
                    $(this.selectors[i].from.time).val('');
                    $(this.selectors[i].from.date).datepicker('setDate', null);
                }
                if (values[i] && values[i].to) {
                    $(this.selectors[i].to.time).val(values[i].to.time).change();
                    $(this.selectors[i].to.date).datepicker('setDate', values[i].to.date);
                } else {
                    $(this.selectors[i].to.time).val('');
                    $(this.selectors[i].to.date).datepicker('setDate', null);
                }
            }
        }
    },

}
