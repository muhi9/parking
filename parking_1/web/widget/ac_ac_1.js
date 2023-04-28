/*
    Events:
        autocomplete_filter(XHR parameters) - Befere XHR search request
        autocomplete_change({id: null/int, value: 'Suggested text'}) - Cahnge value
        autocomplete_create({id: null, value: 'New element text'}) - Before XHR create call
        autocomplete_created(XHR response) - After XHR create call
        autocomplete_clear() - Called after autocomplete_change({id: null, value: ''})
*/

function typeahead(selector) {
    if (this==window) {
        // create object
        return new typeahead(selector);
    } else {
        this.selector = selector;
        this.element = $(this.selector).data('api', this);
        this.disabled = !!this.element.attr('disabled');
        this.hideClear = !!this.element.attr('hideclear');
        this.input = $(this.selector.replace(/_label$/, '')).data('api', this);
        this.url = this.element.data('url');
        this.url_create = this.element.data('url-create');
        this.url_reload = this.element.data('url-reload');
        this.url_image = this.element.data('url-image');
        this.path = this.element.data('path') || false;
        this.additionalFilterFields = this.element.data('fields');
        this.current = {id: this.input.val(), value: this.element.val()};
        this.clearTextOnBlur = !!this.element.data('clear-text-on-blur');
        this.singleField();
        this.linkToElementControls();
        this.clearSelectionControls();
        this.createNewElementControls();
    }
}

typeahead.prototype = {
    selector: '',
    disabled: false,
    hideClear: false,
    element: null,
    input: null,
    url: '',
    url_create: '',
    url_reload: '',
    url_image: '',
    clearTextOnBlur: true,
    path: '',
    pathElement: null,
    additionalFilterFields: {},
    current : {id: null, value: null},
    runwaySelector: '',
    runwayElement: null,


    // prepare instance
    singleField: function() {
        var that = this;
        this.current = this.current || {
            id: this.input.val(),
            value: this.element.val()
        };
        if (!this.disabled) {
            this.element.autocomplete({
                autoFocus: true,
                source: function(request, response) {
                    var url = that.prepareRequestURL(request.term);
                    sendQeury(url).done(response);
                },
                select: function(event, ui) {
                    that.setCurrent(ui.item);
                },
                focus: function(event, ui) {
                    that.changeImage(ui.item.id);
                }
            }).keyup(function(event) {
                if (event.which==13) {
                    this.blur();
                    return false;
                }
            }).blur(function() {
                if (that.element.val()!=that.current.value) {
                    if (that.clearTextOnBlur) {
                        that.setCurrent();
                    } else {
                        that.setCurrent({id:null, value: that.element.val()});
                    }
                }
            }).autocomplete('instance')._renderItem = function(ul, item) {
                return $('<li class="ac_item' + (that.url_image ? ' ac_item_image' : '') + '">')
                    .append('<div>' + (that.url_image ? '<img src="' + that.url_image.replace(/__QUERY__/g, item.id) + '" alt="" />' : '') + item.value + '</div>')
                    .appendTo(ul);
            };
            this.element.parents('form:first').bind('reset', function(){
                that.clear();
            });
        }
        return this;
    },


    // disable autocomplete
    disable: function() {
        this.element.autocomplete('disable');
    },


    // enable autocomplete
    enable: function() {
        this.element.autocomplete('enable');
    },


    clear: function() {
        this.element.val('');
        this.input.val('');
        this.setCurrent();
        this.element.trigger('autocomplete_clear');
    },


    changeImage: function(id) {
        if (this.url_image) {
            this.element.parent().find('img').attr('src', this.url_image.replace(/__QUERY__/g, id || 0));
        }
    },


    // link button
    linkToElementControls: function() {
        if (this.path) {
            var that = this,
                pathElement = $('<a target="_blank"  tabindex="-1" ><span class="la la-external-link"></span></a>').prependTo(this.element.parent()),
                handler = function(ev, suggestion) {
                    if (suggestion.id) {
                        pathElement.attr('href', that.path.replace(/00000/g, suggestion.id));
                        pathElement.fadeTo('fast', 1);
                    } else {
                        pathElement.removeAttr('href');
                        pathElement.fadeTo('fast', .2);
                    }
                };
            this.element.bind('autocomplete_change', handler);
            handler(null, {id: this.input.val()});
        }
    },


    // clear button
    clearSelectionControls: function() {
        if (!this.disabled) {
            var that = this;
            if(!that.hideClear) {
                this.clearElement = $('<span class="la la-close clearbut"></span>').prependTo(this.element.parent()).click(function() {
                    that.clear();
                });
            }

        }
    },


    // create new elements before form submit
    createNewElementControls: function() {
        if (!this.url_create) {
            return false;
        }
        var that = this,
            text = false,
            formSubmitHandlerForCreation = function() {
                var saveNewElement = that.element.parents('form').length!=0;
                that.element.trigger('autocomplete_create', {id:null, value:text});
                sendQeury(that.url_create.replace('__QUERY__', text)).done(function(data, textStatus, jqXHR) {
                    text = data.value;
                    that.element.val(data.value);
                    that.input.val(data.id);
                    that.element.trigger('autocomplete_created', data);
                    that.element.parents('form').first().trigger('submit');
                });
                that.element.parents('form').first().unbind('submit', formSubmitHandlerForCreation);
                return false;
            };
        this.element.bind('autocomplete_change', function(ev, suggestion) {
            text = suggestion.value.replace(/(^\s+)|(\s+$)/g, '');
            if (suggestion.id && text) {
                that.element.parents('form').first().unbind('submit', formSubmitHandlerForCreation);
            } else if (text) {
                that.element.parents('form').first().bind('submit', formSubmitHandlerForCreation);
            }
        });
        this.element.bind('autocomplete_clear', function(ev) {
            that.element.parents('form').first().unbind('submit', formSubmitHandlerForCreation);
        });
    },


    // prepare URL, add all filters
    prepareURL: function(url, query, id) {
        // q = encodeURIComponent(query).replace(/%2f/gi, "_|_"),
        var q = encodeURIComponent(query || '').replace(/%2f/gi, "_|_"),
            //result = this.url.replace('__QUERY__', q) + (this.url.indexOf('?')==-1 ? '?' : '&'),
            result = url.replace('__QUERY__', q).replace('__ID__', id || '') + (this.url.indexOf('?')==-1 ? '?' : '&'),
            filters = this.element.data('filters') || {},
            i, tmp, params = {};
        // data from form fields
        for (i in this.additionalFilterFields) {
            tmp = $('#'+this.additionalFilterFields[i]);
            if (tmp.data('datepicker')) {
                tmp = tmp.datepicker('getDate');
                if (!tmp) {
                    continue;
                }
                tmp = tmp.getFullYear()+'-'+('0' + (tmp.getMonth()+1)).substr(-2)+'-'+('0' + tmp.getDate()).substr(-2)
                    +' '+('0' + tmp.getHours()).substr(-2)+':'+('0' + tmp.getMinutes()).substr(-2)+':'+('0' + tmp.getSeconds()).substr(-2);
            } else {
                tmp = tmp.val();
            }
            params[i] = tmp;
        }
        // data from predefined filters
        for (i in filters) {
            params[i] = filters[i]===true ? 1 : (filters[i]===false ? 0 : filters[i]);
        }
        // prepare url with filters
        this.element.trigger('autocomplete_filter', params);
        for (i in params) {
            result += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]) + '&';
        }

        return result.slice(0, -1);
    },
    prepareRequestURL: function(query) {
        return this.prepareURL(this.url, query);
    },

    // airport -> runway fields
    bindRunwayField: function(runwaySelector) {
        var that = this;
        this.runwaySelector = runwaySelector;
        this.runwayElement = $(this.runwaySelector);
        this.element.bind('autocomplete_change', function(ev, suggestion) {
            var out = [];
            if(suggestion.runways) {
                if (that.runwayElement.find('[value=""],:not([value])').length) {
                out[out.length] = $('<div>').append(that.runwayElement.find('[value=""],:not([value])').clone()).html();
                }
                for (var i=0; i<suggestion.runways.length; i++) {
                    out[out.length] = '<option value="'+suggestion.runways[i].id+'">'+suggestion.runways[i].designator+'</option>';
                }    
            }
            
            that.runwayElement.html(out.join(''));
        });
        return this;
    },


    setCurrent: function(current) {
        current = current || {};
        current.id = current.id || null,
        current.value = current.value || (this.url_create ? this.element.val() : '');
        if (this.current.value!=current.value || this.current.id!=current.id) {
            this.current = current;
            this.changeImage(current.id);
            this.input.val(current.id);
            this.element.val(current.value);
            this.element.trigger('autocomplete_change', current);
        }
    },
    
    reload: function() {
        if(this.url_reload) {
            var url = this.prepareURL(this.url_reload, '', this.current.id),
            element = this.element;
            sendQeury(url).done(function(response){
                element.trigger('autocomplete_change', response);
            });
        }else{
            console.error('not found reload url');
        }
    },

    getCurrent: function() {
        return this.current;
    },
}
