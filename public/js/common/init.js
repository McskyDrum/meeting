var isDebug = false;
var APP_CONTEXT = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
APP_CONTEXT = '';
var API_DOMAIN = /\.(com|net|org|cn)$/i.test(location.hostname)
? location.hostname
: 'localhost:1788';
var strProtocal = location.protocol;
var API_URL = strProtocal + "//" + API_DOMAIN + "/api/services/mall/";
var ua = navigator.userAgent.toLowerCase();
var isWeixin = ua.indexOf('micromessenger') != -1;
var ROOT_URL = strProtocal + "//" + API_DOMAIN;
var fbDate = "20171022";

document.write('<link rel="stylesheet" href="' + APP_CONTEXT + '/css/base.css?'+ fbDate +'" />');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/libs/jquery-1.10.2.min.js"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/libs/jquery.cookie.js"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/libs/jquery.scrollLoading.js"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/libs/template.js"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/common/app.js?'+ fbDate +'"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/common/templateheper.js?'+ fbDate +'"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/common/mtap.js?'+ fbDate +'"></script>');
document.write('<script type="text/javascript" src="' + APP_CONTEXT + '/js/common/moment.min.js?'+ fbDate +'"></script>');