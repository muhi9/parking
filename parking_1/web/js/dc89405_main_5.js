function deleteConf(e){var t="\n";$(e).closest("tr").find("td").not(":last").each((function(k,v){t+=$(v).text()+"\n"}));var del=confirm("Are you sure you want to delete?"+t);return del}function sendQeury(url,sendData){var defProps={dataType:"JSON",type:"POST"};var props={};if(arguments.length>2){console.log(arguments);props=arguments[2];if(props["type"]!==undefined){defProps["type"]=props["type"]}if(props["dataType"]!==undefined){defProps["dataType"]=props["dataType"]}}if(url.substr(0,1)!="/"&&url.substr(0,10).indexOf("//")<0)url=base+url;var hasError=false;if(sendData===undefined){var data={}}else{var data=sendData instanceof FormData?sendData:$.param(sendData)}var contentType=sendData instanceof FormData?false:undefined;var showLogError=function(data,jqXHR,textStatus,messageBody){hasError=true;var doNotLogMe=false;var retrieved={DataReported:{URL:url,status:textStatus,message:messageBody,time:(new Date).toTimeString(),readyState:jqXHR.readyState,serverErorCode:jqXHR.status,profile:profileId},fdata:{}};if(data instanceof FormData){data=data.entries();var obj=data.next();while(undefined!==obj.value){retrieved["fdata"][obj.value[0]]=obj.value[1];obj=data.next()}}else{retrieved["fdata"]=data}var errorType="UNKOWN. Nothing matched.";if(jqXHR.readyState==0)errorType="NETWORK ERROR! No connection to server!";if(jqXHR.readyState==4&&jqXHR.status<300)errorType="Script servrer side error";if(jqXHR.readyState==4&&jqXHR.status>399&&jqXHR.status<500)errorType="Server error 4xx";if(jqXHR.readyState==4&&jqXHR.status>499)errorType="Server error 5xx";if(jqXHR.readyState==4&&jqXHR.status==500)errorType="<b>Script server error! Looks like a bug. Report sent.</b>";var body="<b>Server error code:</b> "+status+"<br>\n"+"<b>URL:</b> "+url+"<br>\n"+"<b>Status:</b> "+textStatus+"<br>\n"+"<b>Message:</b> "+messageBody+"<br>\n"+"<b>Report Data length:</b> "+Object.keys(retrieved["fdata"]).length+"<br>\n"+"<b>Error type:</b>"+errorType+"<br>\n";if(retrieved["fdata"]["_no_fail_send"]!==undefined&&retrieved["fdata"]["_no_fail_send"]=="true"){doNotLogMe=true}if(jqXHR.readyState==0||jqXHR.readyState==4&&jqXHR.status!=500&&jqXHR.status!=200){doNotLogMe=true;console.log("do not log",jqXHR.readyState,jqXHR.status)}if(doNotLogMe==false&&env!="dev"){$('#_bugs_dialog form [name="bugs_form[type]"] option').each((function(){var sl=false;if($(this).text().trim()=="Bug"){sl=true}$(this).attr("selected",sl)}));$("#bugs_form_description").val("Report from AJAX fail code.");$("#bugs_form_pageForms").val(JSON.stringify(retrieved,null,4));$('form[name="bugs_form"]').append('<input name="_no_fail_send" value="true"/>');setTimeout((function(){console.log("submit bug form");$('form[name="bugs_form"]').submit()}),300);setTimeout((function(){$('form[name="bugs_form"] input[name="_no_fail_send"]').remove();$("#bugs_form_description").val("");$("#bugs_form_pageForms").val("")}),2e3)}sysMsg.show({title:"Error performing ajax query",body:body});var mask=$(".ajax_loading_mask");if(mask){mask.fadeTo("slow",0,(function(){mask.detach()}))}};var xhr=$.ajax({url:url,type:defProps["type"],dataType:defProps["dataType"],data:data,processData:false,contentType:contentType}).fail((function(jqXHR,textStatus,errorThrown){showLogError(data,jqXHR,textStatus,errorThrown)})).always((function(rdata,textStatus,jqXHR){if(rdata instanceof Object==true){if(rdata["error"]!==undefined){showLogError(data,jqXHR,textStatus,rdata["error"])}}})).done((function(data){if(data instanceof Object==true){if(data["formErrors"]!==undefined&&sendData["data"]!==undefined&&sendData["data"]["validateCustomAjax"]!==undefined&&true===sendData["data"]["validateCustomAjax"]){var errorsStr="";for(var fe in data["formErrors"]){errorsStr+="<b>"+fe+":</b> <i>"+data.formErrors[fe]+"</i><br>"}sysMsg.show({title:"Form validation error",body:"<b>Errors:</b> <hr>"+errorsStr});var mask=$(".ajax_loading_mask");if(mask){mask.fadeTo("slow",0,(function(){mask.detach()}))}}}}));return xhr}function msToDate(ms,format){var date=new Date(ms);var d=date.getDate()<10?"0"+date.getDate():date.getDate();var m=date.getMonth()<9?"0"+parseInt(date.getMonth()+1):parseInt(date.getMonth()+1);var y=date.getFullYear();var h=date.getHours()<10?"0"+date.getHours():date.getHours();var min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();var dateString=null;switch(format){case"dd.mm.yyyy HH:MM":dateString=d+"."+m+"."+y+" "+h+":"+min;break;case"dd-mm-yyyy HH:MM":dateString=d+"-"+m+"-"+y+" "+h+":"+min;break;case"dd.mm.yyyy":dateString=d+"."+m+"."+y;break;case"dd-mm-yyyy":dateString=d+"-"+m+"-"+y;break;default:dateString=y+"-"+m+"-"+d+" "+h+":"+min}return dateString}function timeToMs(timetoms){timetoms=timetoms.split(":");htoms=parseInt(timetoms[0])*60*60*1e3;mtoms=parseInt(timetoms[1])*60*1e3;result_ms=parseInt(htoms+mtoms);return result_ms}function isScrolledIntoView(elem){var docViewTop=$(window).scrollTop();var docViewBottom=docViewTop+$(window).height();var elemTop=$(elem).offset().top;var elemBottom=elemTop+$(elem).height();return elemBottom<=docViewBottom&&elemTop>=docViewTop}var sysMsg;var blockLdr;(function($){$(document).ready((function(){sysMsg=new sysMessage;blockLdr=new BlockLoader;if(typeof gridReorder==="function")gridReorder();if(typeof formValidation==="function")formValidation();$('[data-toggle="tooltip"]').tooltip();$('[data-toggle="popover"]').popover();$("textarea.autoresize").each((function(){autosize($(this));autosize.update($(this))}))}))})(jQuery);function showElement(element){element=element.jquery?element:$(element);if(element.length){if(element.is('[type="hidden"]')){if(element.parent().find("input, select, textarea").filter(":visible:first").length>0){element=element.parent().find("input, select, textarea").filter(":visible:first")}else{element=element.parent()}}if(element.length){element.click().parents(".tab-pane").each((function(){$('a[href="#'+this.id+'"]').click()}));setTimeout((function(){$("body,html").scrollTop(element.focus().offset().top-$("#k_header").height()-200)}),250);return true}}return false}(function($){$(document).ready((function(){if(window.location.hash&&window.location.hash.indexOf("openpath=")<0){showElement(window.location.hash);showElement('a[role=tab][href="'+(""+window.location.hash).replace("#","#tabs_")+'"]')}$("div.error").parent().find("input, select, textarea").first().each((function(){showElement(this)}));$(".touppercase").blur((function(){if(this.value){this.value=this.value.toUpperCase()}}));$(document).on("mouseover",".dynamic li .btn-delete",(function(){$(this).parent().css("background","#f7eaea")}));$(document).on("mouseout",".dynamic li .btn-delete",(function(){$(this).parent().css("background","")}));var picker=$("#dashboard_daterangepicker");var start=moment();var end=moment();function cb(start,end,label){var title="";var range="";if(end-start<100||label=="Today"){title="Today:";range=start.format(i18n.date_format.toUpperCase())}else if(label=="Yesterday"){title="Yesterday:";range=start.format(i18n.date_format.toUpperCase())}else{range=start.format(i18n.date_format.toUpperCase())+" - "+end.format(i18n.date_format.toUpperCase())}picker.find("#dashboard_daterangepicker_date").html(range);picker.find("#dashboard_daterangepicker_title").html(title)}picker.daterangepicker({direction:KUtil.isRTL(),startDate:start,endDate:end,opens:"left",applyClass:"btn btn-sm btn-primary",cancelClass:"btn btn-sm btn-secondary",locale:{format:i18n.date_format.toUpperCase()},ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]}},cb);cb(start,end,"")}))})(jQuery);$("form").each((function(){var $that=$(this);$that.on("change",'select[name*="units"]',(function(){$('input[type=hidden][data-units-field="'+(this.name||"").replace(/^.+\[([^\]]+)\]$/,"$1")+'"]',$that).val($(this).val())}));$that.find(".btn.add").click((function(){setTimeout((function(){$('select[name*="units"]',$that).change()}),250)}))}));function convert(value,from,to){if(!value||typeof from=="undefined"||typeof to=="undefined"){return value}var result=null;var conversions={mm:{mm:1,m:1e3,km:1e6,in:25.4000000259,ft:304.799999537,sm:1609347.2187,nm:1852e3},m:{mm:.001,m:1,km:1e3,in:.0254000000259,ft:.304799999537,sm:1609.3472187,nm:1852},km:{mm:1e-6,m:.001,km:1,in:254000000259e-16,ft:.000304799999537,sm:1.6093472187,nm:1.852},in:{mm:.0393700787,m:39.3700787,km:39370.0787,in:1,ft:.0833333333,sm:63360,nm:72913.3848048},ft:{mm:.0032808399,m:3.2808399,km:3280.8399,in:12,ft:1,sm:5280,nm:6076.11562192},sm:{mm:6.21369949493e-7,m:.000621369949493,km:.621369949493,in:157828282828e-16,ft:.000189393939394,sm:1,nm:1.15077944789},nm:{mm:5.39956803456e-7,m:.000539956803456,km:.539956803456,in:13714903e-12,ft:.00016457883,sm:.868976242,nm:1},l:{l:1,m3:1e3,"US gal":3.78541178913,"UK gal":4.54609188687,qt:.946352945492},m3:{l:.001,m3:1,"US gal":.00378541178913,"UK gal":.00454609188687,qt:.000946352945492},"US gal":{l:.264172052,m3:264.172052,"US gal":1,"UK gal":1.20095042256,qt:.25},"UK gal":{l:.219969157,m3:219.969157,"US gal":.83267384,"UK gal":1,qt:.20816846001},qt:{l:1.05668821,m3:1056.68821,"US gal":4,"UK gal":4.80380169,qt:1},kg:{kg:1,ton:1e3,lb:.45359237038},ton:{kg:.001,ton:1,lb:.00045359237038},lb:{kg:2.20462262,ton:2204.62262,lb:1},Pa:{Pa:1,hPa:100,inHg:3386,mmHg:133.322368368},hPa:{Pa:.01,hPa:1,inHg:33.86,mmHg:1.33322368368},inHg:{Pa:.000295333727,hPa:.0295333727,inHg:1,mmHg:.039374592},mmHg:{Pa:.00750061683,hPa:.750061683,inHg:25.3970886,mmHg:1},sec:{sec:1,min:60,hr:3600},min:{sec:.01666666666667,min:1,hr:60},hr:{sec:.000277777777778,min:.0166666666666,hr:1},"m/s":{"m/s":1,"km/h":.277777778,mph:.44704,"ft/m":3.2808399,"ft/s":.3048,kt:.514444444},"km/h":{"m/s":3.6,"km/h":1,mph:1.609344,"ft/m":.018288,"ft/s":1.09728,kt:1.852},mph:{"m/s":2.23693629,"km/h":.621371192,mph:1,"ft/m":.0113636364,"ft/s":.681818182,kt:1.15077945},"ft/m":{"m/s":196.850394,"km/h":54.6806649,mph:88,"ft/m":1,"ft/s":60,kt:101.268591},"ft/s":{"m/s":3.2808399,"km/h":.911344415,mph:1.46666667,"ft/m":.0166666667,"ft/s":1,kt:1.68780986},kt:{"m/s":1.94384449,"km/h":.539956803,mph:2.23693629,"ft/m":.0113636364,"ft/s":.681818182,kt:1},"l/h":{"l/h":1,"US gal/h":3.78541178},"US gal/h":{"l/h":.264172052,"US gal/h":1}};if(typeof conversions[to]!=="undefined"&&typeof conversions[to][from]!=="undefined"){result=value*conversions[to][from]}return result}