var Ucenter = (function ($) {
    var vm = {};
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 45);
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        $.get("/userCenter/userInfo",function(result){
            if(!result.success){
                return;
            }
            // $("#userImg").attr("src",result.userInfo.userImg);
            // $("#userName").html(result.userInfo.name);
            vm.userInfo = result.userInfo;
            vm.orderInfo = result.orderInfo;
            // if(orderInfo.waitPayOrderCount>0){//待支付
            // }
            // if(orderInfo.canOpenOrderCount>0){//待使用
            // }
        });
        vm = new Vue({
            el: '#usercenter',
            data: {
                userInfo: {},
                orderInfo: {}
            },
            mounted: function () {
            },
            methods:{
            }
        })
    }

    return {
        init: init
    }
})(jQuery);