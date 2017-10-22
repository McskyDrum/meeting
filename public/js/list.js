var List = (function ($) {
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 90);
        $.ajax({
            type: "post",
            url: API_URL + "api/getMeetings",
            dataType: 'json',
            data: {
                'addr' : '阿里巴巴创新中心·优客工场',
                'plantId' : 10083,
                'date' : '2017-10-22'
            },
            isLoading: true,
            success: function (result) {
                if (!result.success) {
                    initEvent();
                    console.log(result.error.message);
                    return false;
                } else {
                    initEvent();
                }
            }
        });

        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        $(".js-lazy").scrollLoading();
        $('.btn-primary').unbind().on('click',function(){
            location.href = './pay.html';
        });
    }

    return {
        init: init
    }
})(jQuery);