function initPeriods(selector) {
	if (this===window) {
		return new initPeriods(selector);
	}
	this.element = $(selector);
	this.init();
}
initPeriods.prototype = {
	element: null,
	speed: 'medium',

	init: function() {
		var that = this;
		this.element.find('[data-period]').bind('row.add', function() {
			var period = $(this).data('period');
			$('input[type=hidden][name*=periodDefinition]', this).val(period);
			setTimeout(function() {
				that.updateAvailabilityChart(period);
			}, 50);
		});
		this.element.find('.day').click(function() {
			var $this = $(this),
				period = $this.data('period');
			if ($this.is('.active')) {
				that.element.find('.periods > [data-period="'+period+'"]').hide(that.speed);
				$this.removeClass('active');
			} else {
				that.element.find('.periods > [data-period]:not([data-period="'+period+'"])').hide(that.speed);
				that.element.find('.periods > [data-period="'+period+'"]').show(that.speed);
				that.element.find('.day.active').removeClass('active');
				$this.addClass('active');
			}
		});
		this.element.on('change', 'select', function() {
			that.updateAvailabilityChart($(this).parents('li:first').find('input[type=hidden][name*=periodDefinition]').val(), this);
		});
		this.element.find('.day[data-period]').each(function() {
			that.updateAvailabilityChart($(this).data('period'));
		});
	},

	updateAvailabilityChart: function(period, updateElement) {
		var periods = [];
		this.element.find('input[type=hidden][name*=periodDefinition][value="'+period+'"]').next().each(function() {
			var $this = $(this),
				$select = $('select', this),
				start_h = ~~$select.filter('[name*="[start][hour]"]').val(),
				start_m = ~~$select.filter('[name*="[start][minute]"]').val(),
				end_h = ~~$select.filter('[name*="[end][hour]"]').val(),
				end_m = ~~$select.filter('[name*="[end][minute]"]').val(),
				left = ((start_h * 60 + start_m) / 14.4),
				width = ((end_h * 60 + end_m) / 14.4) - left;
			if (width<0) { // wrong time
				if ($select.filter(updateElement).is('[name*="[start]"]')) { // change end time
					end_h = start_h;
					end_m = start_m;
					$select.filter('[name*="[end][hour]"]').val(end_h);
					$select.filter('[name*="[end][minute]"]').val(end_m);
				} else { // change start time
					start_h = end_h;
					start_m = end_m;
					$select.filter('[name*="[start][hour]"]').val(start_h);
					$select.filter('[name*="[start][minute]"]').val(start_m);
				}
				left = ((start_h * 60 + start_m) / 14.4);
				width = ((end_h * 60 + end_m) / 14.4) - left;
			}
			periods[periods.length] = $('<div class="mark">').css({
				left: left + '%',
				width: width>0 ? width + '%' : null,
			})
			periods[periods.length-1].html('<div></div>').find('div').attr('title', start_h+':'+('0'+start_m).substr(-2)+' - '+end_h+':'+('0'+end_m).substr(-2)).mouseover(function() {
				$select.addClass('show-row');
			}).mouseleave(function() {
				$select.removeClass('show-row');
			});
		})
		this.element.find('div.day[data-period='+period+'] .available').html('').append(periods);
	}
}
