function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
		return unescape(r[2]); 
	}else{
		return null;
	}
}

//ajax预设置
$(document).ajaxSend(function (event, request, settings) {
    if (typeof isDebug != "undefined" && isDebug) {
        settings.crossDomain = true;
    }
	if (settings.isLoading) {
		$("#loading_page").show();
	}
}).ajaxError(function (event, request, settings) {
	$("#loading_page").hide();
}).ajaxSuccess(function(event, request, settings){
	if (settings.isHideLoading == true) {
		$("#loading_page").hide();
    }
});

$.ajaxSetup({
	"timeout": 30000
});

$(function(){
	$('<div id="loading"><img src="/image/ajax-loader.gif" width="60" height="60" /></div>').appendTo($("body"));
});