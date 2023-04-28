/*$('.crew').on('typeahead:change', function(ev, suggestion) {
    var $target = $(ev.target),
        $position = $target.parents('.row:first').find('select[name*="[position]"]'),
        selected_suggestion = $target.data('suggestion') || {},
        passengerOnly = false;
    if (selected_suggestion.value!=suggestion || (selected_suggestion.roles.length==1 && selected_suggestion.roles.indexOf('ROLE_PASSENGER')!=-1)) {
        passengerOnly = true;
    }
    $position.find('option:not([data-key="ROLE_PASSENGER"])').attr('disabled', passengerOnly);
    if (passengerOnly) {
        $position.val($position.find('option[data-key="ROLE_PASSENGER"]').val());
    }
}).on('typeahead:select', function(ev, suggestion) {
    $(ev.target).data('suggestion', suggestion);
});*/