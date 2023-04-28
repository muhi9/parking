function daterange(periodSelector, startSelector, endSelector, ranges) {
    if (this===window) {
        return new daterange(periodSelector, startSelector, endSelector, ranges);
    } else {
        
        this.period = $(periodSelector);
        this.start = $(startSelector);
        this.end = $(endSelector);
        this.ranges = ranges||null;
        this.init();
    }
}
daterange.prototype = {
    default_ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(7, 'days'), moment()],
            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
    init: function() {
        this.ranges = this.getRange();
        var that = this; 
        that.period.daterangepicker({
            opens: 'center',
            applyClass: "btn btn-sm btn-primary",
            cancelClass: "btn btn-sm btn-secondary",
            locale: {
                format: i18n.date_format.toUpperCase(),
            },
            ranges: that.ranges,
        }, function(start, end, label) {
            var data = {
                    from: start,
                    to: start,
                    start: that.start,
                    end: that.end,
                    period: label,
                };

            that.start.trigger('range:from', data).datepicker('setDate',start.format(i18n.date_format.toUpperCase()));
            that.end.trigger('range:to', data).datepicker('setDate',end.format(i18n.date_format.toUpperCase()));
            that.period.trigger('range', data);
        });
    },
    getRange: function() {
        var tmp_ranges = {},
            allowed_periods = ['days', 'month', 'year'];
        if(this.ranges) {
            for(range in this.ranges) {
                this.ranges[range].period = allowed_periods.includes(this.ranges[range].period)?this.ranges[range].period:'days'; 
                tmp_ranges[range] = this.generateRange(this.ranges[range]);
            }
        } else {
            tmp_ranges = this.default_ranges;
        }
        return tmp_ranges;
    }, 
    generateRange: function(range) {
        var temp_val = parseInt(range.value);
        if(range.period == 'days') {
            temp_val = parseInt(temp_val-1)>0?parseInt(temp_val):1;
        }
        return !range['extra']?[moment().subtract(temp_val, range.period), moment()]:this.preDefinedPeriodRange(range['extra']);
    }, 
    preDefinedPeriodRange: function(period) {
        switch(period) {
            case 'today':
                return [moment(), moment()];
            break;
            case 'yesterday':
                return [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
            break;
            case 'this_month':
                return [moment().startOf('month'), moment().endOf('month')];
            break;
            case 'last_month':
                return [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
            break;
            default:
                return [moment(), moment()];
            break;
        }
    },

}