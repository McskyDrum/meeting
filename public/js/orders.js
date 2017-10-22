var Orders = (function ($) {
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 45);
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
    }

    return {
        init: init
    }
})(jQuery);