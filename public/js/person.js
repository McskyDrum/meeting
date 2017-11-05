var Person = (function ($) {
    var mClick = "ontouchend" in document ? "touchstart" : "click";
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh);
        getUserInfo()
    }

    function getUserInfo(){
        $.get("/users/getUserInfo",function(result){
            if(!result.success){
                return;
            }
            var user = result.user;
            initEvent(user);
        });
    }

    //页面事件初始化
    function initEvent(user){
        var vm = new Vue({
            el: '#user',
            data: user,
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