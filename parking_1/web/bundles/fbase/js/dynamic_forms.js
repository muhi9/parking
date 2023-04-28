/*
$(document).ready(function() {
	$('ul[data-prototype]')

	.filter(':not(data-ready)')
	// set next item index
	.each(function() {

		var $this = $(this);
		$this.data({
			index: $this.data('index') || $this.find('>li').length - $this.find('>li>.add').length, // next item index
			ready: true,
		});
	})

	// "add new" button
	.on('click', '>li>.add', function(e) {
		console.log(e);
		var $ul = $(e.delegateTarget),
			prototype = $ul.data('prototype') || "",
			index = $ul.data('index') || 0,
			row = prototype.replace(/__name__/g, index);

		$ul.data('index', index+1);
		$(row).insertBefore(e.target.parentNode).trigger('row.add').find('input,select,textarea').not(':hidden,[readonly]').first().focus();
	})

	// "delete" button
	.on('click', '.btn-danger', function(e) {
		$(this).parents('li:first').trigger('row.add').remove();
	});

	$('div.error').parent().find('input, select, textarea').first().each(function() {
		showElement(this);
	})
});
*/

/*
	Events:
		before_remove($(this).parents('li:first')) - Before remove row 
*/
(function() {

	function recalcUpdateNames(type, target) {
setTimeout(function() {
		console.log('run coll', type, target, target.closest('ul.dynamic').find('li div.row'));
		var ul = target.closest('ul.dynamic');
		var rows = ul.find('li');
		//if (type == 'add')
		let index = 0;
		//if (type == 'delete')
		//	var index = rows.length;
		if (rows.length > 0) {

			var rowsLen = rows.length;
			rows.each(function() {
				var els = $(this).find('input,select,text');
				if (els.length > 0) {
					els.each(function(idx, el) {
						//if ($(el).attr('name') === undefined) return;
							//console.log(index, $(el),$(el).attr('name'));
							if ($(el).attr('name') === undefined) {
								console.log('NO attr NAME',$(el));
							} else {
								var match = $(el).attr('name').match(/^(.*)(\[\d+\])(.*)$/);
								//console.log('NAME MATCH',index,match,$(el),$(el).attr('name'),elName, elId);
								if (match !== null && match.length > 1) {
									var elPre = match[1];
									var elPost = match[3];
									var elName = elPre+'['+(index)+']'+elPost;
									var elId = elName.replace(/\[/g, '_').replace(/]/g, '_').replace(/_$/,'').replace(/__/g,'_');
									$(el).attr('name', elName);
									//$(el).attr('id', elId);
								}
							}
					});
					//console.log($(this));
					//if (type == 'add') index++;
					//if (type == 'delete') index--;
				}
			index++;
			});

		}
		/*
		if (index-2 < 0) {
			index = 0;
		} else {
			index = index-2;
		}
		*/
		//index=index-1;
		//console.log("SET INDEX", index);
		//ul.data('index', index);
		//ul.attr('data-index', index);
}, 200);

	}
  function prepare(selector) {
    $(selector)
  //  .filter(':not([data-ready])')
	.filter(function(i,e){
		return !$(e).data('ready');
	})
    // set next item index
    .each(function() {
    	var $this = $(this);
    	$this.data({
	        index: $this.data('index') || $this.find('>li').length - $this.find('>li>.add').length, // next item index
	        replace: $this.data('replace') || '__name__',
	        ready: true,
      	});
    //  	$this.attr('data-ready',true);
    })

    // "add new" button
    .on('click', '>li>.add', function(e) {
    	$(row).trigger('row.before_add');
    	recalcUpdateNames('add', $(this));
     	var $ul = $(e.delegateTarget),
	        prototype = $ul.data('prototype') || "",
	        index = $ul.data('index') || 0;
	        index++;
	        var row = prototype.replace(new RegExp($ul.data('replace'), 'g'), index);
		    $ul.data('index', index);
		  //console.log('adding row', index, $ul);
	    row = $(row).insertBefore(e.target.parentNode).trigger('row.add');
		row.find('ul[data-prototype]').each(function() {
			prepare(this);
		})
	    row.find('input,select,textarea').not(':hidden,[readonly]').first().focus();
    })

    // "delete" button
    .on('click', '.btn-delete', function(e) {
    	var parentUl = $(this).parent().parent();
    	$(this).trigger('before_remove', $(this).parents('li:first'));
     	$(this).parents('li:first').trigger('row.add').remove();
    	recalcUpdateNames('delete', parentUl);
    });

    $('div.error').parent().find('input, select, textarea').first().each(function() {
      showElement(this);
    })
  }

  $(document).ready(function() {
    prepare('ul[data-prototype]');
  });

})()
