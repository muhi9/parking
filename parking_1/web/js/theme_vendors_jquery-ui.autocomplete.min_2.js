/*! jQuery UI - v1.12.1 - 2021-03-13
* http://jqueryui.com
* Includes: widget.js, position.js, keycode.js, unique-id.js, widgets/autocomplete.js, widgets/menu.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}((function(x){x.ui=x.ui||{};x.ui.version="1.12.1";var n,i=0,a=Array.prototype.slice;x.cleanData=(n=x.cleanData,function(t){for(var e,i,s=0;null!=(i=t[s]);s++)try{(e=x._data(i,"events"))&&e.remove&&x(i).triggerHandler("remove")}catch(t){}n(t)}),x.widget=function(t,i,e){var s,n,o,l={},a=t.split(".")[0],r=a+"-"+(t=t.split(".")[1]);return e||(e=i,i=x.Widget),x.isArray(e)&&(e=x.extend.apply(null,[{}].concat(e))),x.expr[":"][r.toLowerCase()]=function(t){return!!x.data(t,r)},x[a]=x[a]||{},s=x[a][t],n=x[a][t]=function(t,e){if(!this._createWidget)return new n(t,e);arguments.length&&this._createWidget(t,e)},x.extend(n,s,{version:e.version,_proto:x.extend({},e),_childConstructors:[]}),(o=new i).options=x.widget.extend({},o.options),x.each(e,(function(e,s){function n(){return i.prototype[e].apply(this,arguments)}function o(t){return i.prototype[e].apply(this,t)}x.isFunction(s)?l[e]=function(){var t,e=this._super,i=this._superApply;return this._super=n,this._superApply=o,t=s.apply(this,arguments),this._super=e,this._superApply=i,t}:l[e]=s})),n.prototype=x.widget.extend(o,{widgetEventPrefix:s&&o.widgetEventPrefix||t},l,{constructor:n,namespace:a,widgetName:t,widgetFullName:r}),s?(x.each(s._childConstructors,(function(t,e){var i=e.prototype;x.widget(i.namespace+"."+i.widgetName,n,e._proto)})),delete s._childConstructors):i._childConstructors.push(n),x.widget.bridge(t,n),n},x.widget.extend=function(t){for(var e,i,s=a.call(arguments,1),n=0,o=s.length;n<o;n++)for(e in s[n])i=s[n][e],s[n].hasOwnProperty(e)&&void 0!==i&&(x.isPlainObject(i)?t[e]=x.isPlainObject(t[e])?x.widget.extend({},t[e],i):x.widget.extend({},i):t[e]=i);return t},x.widget.bridge=function(o,e){var l=e.prototype.widgetFullName||o;x.fn[o]=function(i){var t="string"==typeof i,s=a.call(arguments,1),n=this;return t?this.length||"instance"!==i?this.each((function(){var t,e=x.data(this,l);return"instance"===i?(n=e,!1):e?x.isFunction(e[i])&&"_"!==i.charAt(0)?(t=e[i].apply(e,s))!==e&&void 0!==t?(n=t&&t.jquery?n.pushStack(t.get()):t,!1):void 0:x.error("no such method '"+i+"' for "+o+" widget instance"):x.error("cannot call methods on "+o+" prior to initialization; attempted to call method '"+i+"'")})):n=void 0:(s.length&&(i=x.widget.extend.apply(null,[i].concat(s))),this.each((function(){var t=x.data(this,l);t?(t.option(i||{}),t._init&&t._init()):x.data(this,l,new e(i,this))}))),n}},x.Widget=function(){},x.Widget._childConstructors=[],x.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(t,e){e=x(e||this.defaultElement||this)[0],this.element=x(e),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=x(),this.hoverable=x(),this.focusable=x(),this.classesElementLookup={},e!==this&&(x.data(e,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===e&&this.destroy()}}),this.document=x(e.style?e.ownerDocument:e.document||e),this.window=x(this.document[0].defaultView||this.document[0].parentWindow)),this.options=x.widget.extend({},this.options,this._getCreateOptions(),t),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:x.noop,_create:x.noop,_init:x.noop,destroy:function(){var i=this;this._destroy(),x.each(this.classesElementLookup,(function(t,e){i._removeClass(e,t)})),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:x.noop,widget:function(){return this.element},option:function(t,e){var i,s,n,o=t;if(0===arguments.length)return x.widget.extend({},this.options);if("string"==typeof t)if(o={},t=(i=t.split(".")).shift(),i.length){for(s=o[t]=x.widget.extend({},this.options[t]),n=0;n<i.length-1;n++)s[i[n]]=s[i[n]]||{},s=s[i[n]];if(t=i.pop(),1===arguments.length)return void 0===s[t]?null:s[t];s[t]=e}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=e}return this._setOptions(o),this},_setOptions:function(t){for(var e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(t){var e,i,s;for(e in t)s=this.classesElementLookup[e],t[e]!==this.options.classes[e]&&s&&s.length&&(i=x(s.get()),this._removeClass(s,e),i.addClass(this._classes({element:i,keys:e,classes:t,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(n){var o=[],l=this;function t(t,e){for(var i,s=0;s<t.length;s++)i=l.classesElementLookup[t[s]]||x(),i=n.add?x(x.unique(i.get().concat(n.element.get()))):x(i.not(n.element).get()),l.classesElementLookup[t[s]]=i,o.push(t[s]),e&&n.classes[t[s]]&&o.push(n.classes[t[s]])}return n=x.extend({element:this.element,classes:this.options.classes||{}},n),this._on(n.element,{remove:"_untrackClassesElement"}),n.keys&&t(n.keys.match(/\S+/g)||[],!0),n.extra&&t(n.extra.match(/\S+/g)||[]),o.join(" ")},_untrackClassesElement:function(i){var s=this;x.each(s.classesElementLookup,(function(t,e){-1!==x.inArray(i.target,e)&&(s.classesElementLookup[t]=x(e.not(i.target).get()))}))},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,t={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return t.element.toggleClass(this._classes(t),s),this},_on:function(n,o,t){var l,a=this;"boolean"!=typeof n&&(t=o,o=n,n=!1),t?(o=l=x(o),this.bindings=this.bindings.add(o)):(t=o,o=this.element,l=this.widget()),x.each(t,(function(t,e){function i(){if(n||!0!==a.options.disabled&&!x(this).hasClass("ui-state-disabled"))return("string"==typeof e?a[e]:e).apply(a,arguments)}"string"!=typeof e&&(i.guid=e.guid=e.guid||i.guid||x.guid++);var s=t.match(/^([\w:-]*)\s*(.*)$/),t=s[1]+a.eventNamespace,s=s[2];s?l.on(t,s,i):o.on(t,i)}))},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.off(e).off(e),this.bindings=x(this.bindings.not(t).get()),this.focusable=x(this.focusable.not(t).get()),this.hoverable=x(this.hoverable.not(t).get())},_delay:function(t,e){var i=this;return setTimeout((function(){return("string"==typeof t?i[t]:t).apply(i,arguments)}),e||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){this._addClass(x(t.currentTarget),null,"ui-state-hover")},mouseleave:function(t){this._removeClass(x(t.currentTarget),null,"ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){this._addClass(x(t.currentTarget),null,"ui-state-focus")},focusout:function(t){this._removeClass(x(t.currentTarget),null,"ui-state-focus")}})},_trigger:function(t,e,i){var s,n,o=this.options[t];if(i=i||{},(e=x.Event(e)).type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),e.target=this.element[0],n=e.originalEvent)for(s in n)s in e||(e[s]=n[s]);return this.element.trigger(e,i),!(x.isFunction(o)&&!1===o.apply(this.element[0],[e].concat(i))||e.isDefaultPrevented())}},x.each({show:"fadeIn",hide:"fadeOut"},(function(o,l){x.Widget.prototype["_"+o]=function(e,t,i){var s;"string"==typeof t&&(t={effect:t});var n=t?!0!==t&&"number"!=typeof t&&t.effect||l:o;"number"==typeof(t=t||{})&&(t={duration:t}),s=!x.isEmptyObject(t),t.complete=i,t.delay&&e.delay(t.delay),s&&x.effects&&x.effects.effect[n]?e[o](t):n!==o&&e[n]?e[n](t.duration,t.easing,i):e.queue((function(t){x(this)[o](),i&&i.call(e[0]),t()}))}}));var s,C,E,o,l,r,u,h,k;x.widget;function T(t,e,i){return[parseFloat(t[0])*(h.test(t[0])?e/100:1),parseFloat(t[1])*(h.test(t[1])?i/100:1)]}function W(t,e){return parseInt(x.css(t,e),10)||0}C=Math.max,E=Math.abs,o=/left|center|right/,l=/top|center|bottom/,r=/[\+\-]\d+(\.[\d]+)?%?/,u=/^\w+/,h=/%$/,k=x.fn.position,x.position={scrollbarWidth:function(){if(void 0!==s)return s;var t,e=x("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),i=e.children()[0];return x("body").append(e),t=i.offsetWidth,e.css("overflow","scroll"),t===(i=i.offsetWidth)&&(i=e[0].clientWidth),e.remove(),s=t-i},getScrollInfo:function(t){var e=t.isWindow||t.isDocument?"":t.element.css("overflow-x"),i=t.isWindow||t.isDocument?"":t.element.css("overflow-y"),e="scroll"===e||"auto"===e&&t.width<t.element[0].scrollWidth;return{width:"scroll"===i||"auto"===i&&t.height<t.element[0].scrollHeight?x.position.scrollbarWidth():0,height:e?x.position.scrollbarWidth():0}},getWithinInfo:function(t){var e=x(t||window),i=x.isWindow(e[0]),s=!!e[0]&&9===e[0].nodeType;return{element:e,isWindow:i,isDocument:s,offset:!i&&!s?x(t).offset():{left:0,top:0},scrollLeft:e.scrollLeft(),scrollTop:e.scrollTop(),width:e.outerWidth(),height:e.outerHeight()}}},x.fn.position=function(c){if(!c||!c.of)return k.apply(this,arguments);c=x.extend({},c);var d,f,m,p,v,t,g=x(c.of),_=x.position.getWithinInfo(c.within),y=x.position.getScrollInfo(_),b=(c.collision||"flip").split(" "),w={},e=9===(t=(e=g)[0]).nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:x.isWindow(t)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:t.preventDefault?{width:0,height:0,offset:{top:t.pageY,left:t.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()};return g[0].preventDefault&&(c.at="left top"),f=e.width,m=e.height,p=e.offset,v=x.extend({},p),x.each(["my","at"],(function(){var t,e,i=(c[this]||"").split(" ");1===i.length&&(i=o.test(i[0])?i.concat(["center"]):l.test(i[0])?["center"].concat(i):["center","center"]),i[0]=o.test(i[0])?i[0]:"center",i[1]=l.test(i[1])?i[1]:"center",t=r.exec(i[0]),e=r.exec(i[1]),w[this]=[t?t[0]:0,e?e[0]:0],c[this]=[u.exec(i[0])[0],u.exec(i[1])[0]]})),1===b.length&&(b[1]=b[0]),"right"===c.at[0]?v.left+=f:"center"===c.at[0]&&(v.left+=f/2),"bottom"===c.at[1]?v.top+=m:"center"===c.at[1]&&(v.top+=m/2),d=T(w.at,f,m),v.left+=d[0],v.top+=d[1],this.each((function(){var i,t,l=x(this),a=l.outerWidth(),r=l.outerHeight(),e=W(this,"marginLeft"),s=W(this,"marginTop"),n=a+e+W(this,"marginRight")+y.width,o=r+s+W(this,"marginBottom")+y.height,u=x.extend({},v),h=T(w.my,l.outerWidth(),l.outerHeight());"right"===c.my[0]?u.left-=a:"center"===c.my[0]&&(u.left-=a/2),"bottom"===c.my[1]?u.top-=r:"center"===c.my[1]&&(u.top-=r/2),u.left+=h[0],u.top+=h[1],i={marginLeft:e,marginTop:s},x.each(["left","top"],(function(t,e){x.ui.position[b[t]]&&x.ui.position[b[t]][e](u,{targetWidth:f,targetHeight:m,elemWidth:a,elemHeight:r,collisionPosition:i,collisionWidth:n,collisionHeight:o,offset:[d[0]+h[0],d[1]+h[1]],my:c.my,at:c.at,within:_,elem:l})})),c.using&&(t=function(t){var e=p.left-u.left,i=e+f-a,s=p.top-u.top,n=s+m-r,o={target:{element:g,left:p.left,top:p.top,width:f,height:m},element:{element:l,left:u.left,top:u.top,width:a,height:r},horizontal:i<0?"left":0<e?"right":"center",vertical:n<0?"top":0<s?"bottom":"middle"};f<a&&E(e+i)<f&&(o.horizontal="center"),m<r&&E(s+n)<m&&(o.vertical="middle"),C(E(e),E(i))>C(E(s),E(n))?o.important="horizontal":o.important="vertical",c.using.call(this,t,o)}),l.offset(x.extend(u,{using:t}))}))},x.ui.position={fit:{left:function(t,e){var i=e.within,s=i.isWindow?i.scrollLeft:i.offset.left,n=i.width,o=t.left-e.collisionPosition.marginLeft,l=s-o,a=o+e.collisionWidth-n-s;e.collisionWidth>n?0<l&&a<=0?(i=t.left+l+e.collisionWidth-n-s,t.left+=l-i):t.left=!(0<a&&l<=0)&&a<l?s+n-e.collisionWidth:s:0<l?t.left+=l:0<a?t.left-=a:t.left=C(t.left-o,t.left)},top:function(t,e){var i=e.within,s=i.isWindow?i.scrollTop:i.offset.top,n=e.within.height,o=t.top-e.collisionPosition.marginTop,l=s-o,a=o+e.collisionHeight-n-s;e.collisionHeight>n?0<l&&a<=0?(i=t.top+l+e.collisionHeight-n-s,t.top+=l-i):t.top=!(0<a&&l<=0)&&a<l?s+n-e.collisionHeight:s:0<l?t.top+=l:0<a?t.top-=a:t.top=C(t.top-o,t.top)}},flip:{left:function(t,e){var i=e.within,s=i.offset.left+i.scrollLeft,n=i.width,o=i.isWindow?i.scrollLeft:i.offset.left,l=t.left-e.collisionPosition.marginLeft,a=l-o,r=l+e.collisionWidth-n-o,u="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,i="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,l=-2*e.offset[0];a<0?((s=t.left+u+i+l+e.collisionWidth-n-s)<0||s<E(a))&&(t.left+=u+i+l):0<r&&(0<(o=t.left-e.collisionPosition.marginLeft+u+i+l-o)||E(o)<r)&&(t.left+=u+i+l)},top:function(t,e){var i=e.within,s=i.offset.top+i.scrollTop,n=i.height,o=i.isWindow?i.scrollTop:i.offset.top,l=t.top-e.collisionPosition.marginTop,a=l-o,r=l+e.collisionHeight-n-o,u="top"===e.my[1]?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,i="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,l=-2*e.offset[1];a<0?((s=t.top+u+i+l+e.collisionHeight-n-s)<0||s<E(a))&&(t.top+=u+i+l):0<r&&(0<(o=t.top-e.collisionPosition.marginTop+u+i+l-o)||E(o)<r)&&(t.top+=u+i+l)}},flipfit:{left:function(){x.ui.position.flip.left.apply(this,arguments),x.ui.position.fit.left.apply(this,arguments)},top:function(){x.ui.position.flip.top.apply(this,arguments),x.ui.position.fit.top.apply(this,arguments)}}};var t;x.ui.position,x.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38},x.fn.extend({uniqueId:(t=0,function(){return this.each((function(){this.id||(this.id="ui-id-"+ ++t)}))}),removeUniqueId:function(){return this.each((function(){/^ui-id-\d+$/.test(this.id)&&x(this).removeAttr("id")}))}}),x.ui.safeActiveElement=function(e){var i;try{i=e.activeElement}catch(t){i=e.body}return(i=i||e.body).nodeName||(i=e.body),i},x.widget("ui.menu",{version:"1.12.1",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-caret-1-e"},items:"> *",menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().attr({role:this.options.role,tabIndex:0}),this._addClass("ui-menu","ui-widget ui-widget-content"),this._on({"mousedown .ui-menu-item":function(t){t.preventDefault()},"click .ui-menu-item":function(t){var e=x(t.target),i=x(x.ui.safeActiveElement(this.document[0]));!this.mouseHandled&&e.not(".ui-state-disabled").length&&(this.select(t),t.isPropagationStopped()||(this.mouseHandled=!0),e.has(".ui-menu").length?this.expand(t):!this.element.is(":focus")&&i.closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){var e,i;this.previousFilter||(e=x(t.target).closest(".ui-menu-item"),i=x(t.currentTarget),e[0]===i[0]&&(this._removeClass(i.siblings().children(".ui-state-active"),null,"ui-state-active"),this.focus(t,i)))},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.find(this.options.items).eq(0);e||this.focus(t,i)},blur:function(t){this._delay((function(){x.contains(this.element[0],x.ui.safeActiveElement(this.document[0]))||this.collapseAll(t)}))},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){this._closeOnDocumentClick(t)&&this.collapseAll(t),this.mouseHandled=!1}})},_destroy:function(){var t=this.element.find(".ui-menu-item").removeAttr("role aria-disabled").children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(),t.children().each((function(){var t=x(this);t.data("ui-menu-submenu-caret")&&t.remove()}))},_keydown:function(t){var e,i,s,n=!0;switch(t.keyCode){case x.ui.keyCode.PAGE_UP:this.previousPage(t);break;case x.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case x.ui.keyCode.HOME:this._move("first","first",t);break;case x.ui.keyCode.END:this._move("last","last",t);break;case x.ui.keyCode.UP:this.previous(t);break;case x.ui.keyCode.DOWN:this.next(t);break;case x.ui.keyCode.LEFT:this.collapse(t);break;case x.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case x.ui.keyCode.ENTER:case x.ui.keyCode.SPACE:this._activate(t);break;case x.ui.keyCode.ESCAPE:this.collapse(t);break;default:n=!1,e=this.previousFilter||"",s=!1,i=96<=t.keyCode&&t.keyCode<=105?(t.keyCode-96).toString():String.fromCharCode(t.keyCode),clearTimeout(this.filterTimer),i===e?s=!0:i=e+i,e=this._filterMenuItems(i),(e=s&&-1!==e.index(this.active.next())?this.active.nextAll(".ui-menu-item"):e).length||(i=String.fromCharCode(t.keyCode),e=this._filterMenuItems(i)),e.length?(this.focus(t,e),this.previousFilter=i,this.filterTimer=this._delay((function(){delete this.previousFilter}),1e3)):delete this.previousFilter}n&&t.preventDefault()},_activate:function(t){this.active&&!this.active.is(".ui-state-disabled")&&(this.active.children("[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var t,e,s=this,n=this.options.icons.submenu,i=this.element.find(this.options.menus);this._toggleClass("ui-menu-icons",null,!!this.element.find(".ui-icon").length),e=i.filter(":not(.ui-menu)").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each((function(){var t=x(this),e=t.prev(),i=x("<span>").data("ui-menu-submenu-caret",!0);s._addClass(i,"ui-menu-icon","ui-icon "+n),e.attr("aria-haspopup","true").prepend(i),t.attr("aria-labelledby",e.attr("id"))})),this._addClass(e,"ui-menu","ui-widget ui-widget-content ui-front"),(t=i.add(this.element).find(this.options.items)).not(".ui-menu-item").each((function(){var t=x(this);s._isDivider(t)&&s._addClass(t,"ui-menu-divider","ui-widget-content")})),i=(e=t.not(".ui-menu-item, .ui-menu-divider")).children().not(".ui-menu").uniqueId().attr({tabIndex:-1,role:this._itemRole()}),this._addClass(e,"ui-menu-item")._addClass(i,"ui-menu-item-wrapper"),t.filter(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!x.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){var i;"icons"===t&&(i=this.element.find(".ui-menu-icon"),this._removeClass(i,null,this.options.icons.submenu)._addClass(i,null,e.submenu)),this._super(t,e)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",String(t)),this._toggleClass(null,"ui-state-disabled",!!t)},focus:function(t,e){var i;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),i=this.active.children(".ui-menu-item-wrapper"),this._addClass(i,null,"ui-state-active"),this.options.role&&this.element.attr("aria-activedescendant",i.attr("id")),i=this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper"),this._addClass(i,null,"ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay((function(){this._close()}),this.delay),(i=e.children(".ui-menu")).length&&t&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(t){var e,i,s;this._hasScroll()&&(i=parseFloat(x.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(x.css(this.activeMenu[0],"paddingTop"))||0,e=t.offset().top-this.activeMenu.offset().top-i-s,i=this.activeMenu.scrollTop(),s=this.activeMenu.height(),t=t.outerHeight(),e<0?this.activeMenu.scrollTop(i+e):s<e+t&&this.activeMenu.scrollTop(i+e-s+t))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this._removeClass(this.active.children(".ui-menu-item-wrapper"),null,"ui-state-active"),this._trigger("blur",t,{item:this.active}),this.active=null)},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay((function(){this._close(),this._open(t)}),this.delay))},_open:function(t){var e=x.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(e)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay((function(){var t=i?this.element:x(e&&e.target).closest(this.element.find(".ui-menu"));t.length||(t=this.element),this._close(t),this.blur(e),this._removeClass(t.find(".ui-state-active"),null,"ui-state-active"),this.activeMenu=t}),this.delay)},_close:function(t){(t=t||(this.active?this.active.parent():this.element)).find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false")},_closeOnDocumentClick:function(t){return!x(t.target).closest(".ui-menu").length},_isDivider:function(t){return!/[^\-\u2014\u2013\s]/.test(t.text())},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").find(this.options.items).first();e&&e.length&&(this._open(e.parent()),this._delay((function(){this.focus(t,e)})))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.find(this.options.items)[e]()),this.focus(i,s)},nextPage:function(t){var e,i,s;this.active?this.isLastItem()||(this._hasScroll()?(i=this.active.offset().top,s=this.element.height(),this.active.nextAll(".ui-menu-item").each((function(){return(e=x(this)).offset().top-i-s<0})),this.focus(t,e)):this.focus(t,this.activeMenu.find(this.options.items)[this.active?"last":"first"]())):this.next(t)},previousPage:function(t){var e,i,s;this.active?this.isFirstItem()||(this._hasScroll()?(i=this.active.offset().top,s=this.element.height(),this.active.prevAll(".ui-menu-item").each((function(){return 0<(e=x(this)).offset().top-i+s})),this.focus(t,e)):this.focus(t,this.activeMenu.find(this.options.items).first())):this.next(t)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||x(t.target).closest(".ui-menu-item");var e={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,e)},_filterMenuItems:function(t){var t=t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&"),e=new RegExp("^"+t,"i");return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter((function(){return e.test(x.trim(x(this).children(".ui-menu-item-wrapper").text()))}))}});x.widget("ui.autocomplete",{version:"1.12.1",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var i,s,n,t=this.element[0].nodeName.toLowerCase(),e="textarea"===t,t="input"===t;this.isMultiLine=e||!t&&this._isContentEditable(this.element),this.valueMethod=this.element[e||t?"val":"text"],this.isNewMenu=!0,this._addClass("ui-autocomplete-input"),this.element.attr("autocomplete","off"),this._on(this.element,{keydown:function(t){if(this.element.prop("readOnly"))s=n=i=!0;else{s=n=i=!1;var e=x.ui.keyCode;switch(t.keyCode){case e.PAGE_UP:i=!0,this._move("previousPage",t);break;case e.PAGE_DOWN:i=!0,this._move("nextPage",t);break;case e.UP:i=!0,this._keyEvent("previous",t);break;case e.DOWN:i=!0,this._keyEvent("next",t);break;case e.ENTER:this.menu.active&&(i=!0,t.preventDefault(),this.menu.select(t));break;case e.TAB:this.menu.active&&this.menu.select(t);break;case e.ESCAPE:this.menu.element.is(":visible")&&(this.isMultiLine||this._value(this.term),this.close(t),t.preventDefault());break;default:s=!0,this._searchTimeout(t)}}},keypress:function(t){if(i)return i=!1,void(this.isMultiLine&&!this.menu.element.is(":visible")||t.preventDefault());if(!s){var e=x.ui.keyCode;switch(t.keyCode){case e.PAGE_UP:this._move("previousPage",t);break;case e.PAGE_DOWN:this._move("nextPage",t);break;case e.UP:this._keyEvent("previous",t);break;case e.DOWN:this._keyEvent("next",t)}}},input:function(t){if(n)return n=!1,void t.preventDefault();this._searchTimeout(t)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){this.cancelBlur?delete this.cancelBlur:(clearTimeout(this.searching),this.close(t),this._change(t))}}),this._initSource(),this.menu=x("<ul>").appendTo(this._appendTo()).menu({role:null}).hide().menu("instance"),this._addClass(this.menu.element,"ui-autocomplete","ui-front"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay((function(){delete this.cancelBlur,this.element[0]!==x.ui.safeActiveElement(this.document[0])&&this.element.trigger("focus")}))},menufocus:function(t,e){var i;if(this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type)))return this.menu.blur(),void this.document.one("mousemove",(function(){x(t.target).trigger(t.originalEvent)}));i=e.item.data("ui-autocomplete-item"),!1!==this._trigger("focus",t,{item:i})&&t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(i.value),(i=e.item.attr("aria-label")||i.value)&&x.trim(i).length&&(this.liveRegion.children().hide(),x("<div>").text(i).appendTo(this.liveRegion))},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==x.ui.safeActiveElement(this.document[0])&&(this.element.trigger("focus"),this.previous=s,this._delay((function(){this.previous=s,this.selectedItem=i}))),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=x("<div>",{role:"status","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_isEventTargetInWidget:function(t){var e=this.menu.element[0];return t.target===this.element[0]||t.target===e||x.contains(e,t.target)},_closeOnClickOutside:function(t){this._isEventTargetInWidget(t)||this.close()},_appendTo:function(){var t=this.options.appendTo;return(t=t&&(t.jquery||t.nodeType?x(t):this.document.find(t).eq(0)))&&t[0]||(t=this.element.closest(".ui-front, dialog")),t.length||(t=this.document[0].body),t},_initSource:function(){var i,s,n=this;x.isArray(this.options.source)?(i=this.options.source,this.source=function(t,e){e(x.ui.autocomplete.filter(i,t.term))}):"string"==typeof this.options.source?(s=this.options.source,this.source=function(t,e){n.xhr&&n.xhr.abort(),n.xhr=x.ajax({url:s,data:t,dataType:"json",success:function(t){e(t)},error:function(){e([])}})}):this.source=this.options.source},_searchTimeout:function(s){clearTimeout(this.searching),this.searching=this._delay((function(){var t=this.term===this._value(),e=this.menu.element.is(":visible"),i=s.altKey||s.ctrlKey||s.metaKey||s.shiftKey;t&&(!t||e||i)||(this.selectedItem=null,this.search(null,s))}),this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):!1!==this._trigger("search",e)?this._search(t):void 0},_search:function(t){this.pending++,this._addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var e=++this.requestIndex;return x.proxy((function(t){e===this.requestIndex&&this.__response(t),this.pending--,this.pending||this._removeClass("ui-autocomplete-loading")}),this)},__response:function(t){t=t&&this._normalize(t),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this._off(this.document,"mousedown"),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:x.map(t,(function(t){return"string"==typeof t?{label:t,value:t}:x.extend({},t,{label:t.label||t.value,value:t.value||t.label})}))},_suggest:function(t){var e=this.menu.element.empty();this._renderMenu(e,t),this.isNewMenu=!0,this.menu.refresh(),e.show(),this._resizeMenu(),e.position(x.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(),this._on(this.document,{mousedown:"_closeOnClickOutside"})},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(i,t){var s=this;x.each(t,(function(t,e){s._renderItemData(i,e)}))},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(t,e){return x("<li>").append(x("<div>").text(e.label)).appendTo(t)},_move:function(t,e){if(this.menu.element.is(":visible"))return this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this.isMultiLine||this._value(this.term),void this.menu.blur()):void this.menu[t](e);this.search(null,e)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){this.isMultiLine&&!this.menu.element.is(":visible")||(this._move(t,e),e.preventDefault())},_isContentEditable:function(t){if(!t.length)return!1;var e=t.prop("contentEditable");return"inherit"===e?this._isContentEditable(t.parent()):"true"===e}}),x.extend(x.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,e){var i=new RegExp(x.ui.autocomplete.escapeRegex(e),"i");return x.grep(t,(function(t){return i.test(t.label||t.value||t)}))}}),x.widget("ui.autocomplete",x.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(1<t?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.children().hide(),x("<div>").text(e).appendTo(this.liveRegion))}});x.ui.autocomplete}));