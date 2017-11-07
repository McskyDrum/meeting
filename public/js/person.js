var Person = (function ($) {
    var mClick = "ontouchend" in document ? "touchstart" : "click";

    var vm = {};

    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh);
        initEvent();
    }

    function getUserInfo(){
        $.get("/userCenter/getUserInfo",function(result){
            if(!result.success){
                return;
            }
            var user = result.userInfo;
            vm.name = user.name;
            vm.company = user.company;
            vm.email = user.email;

        });
    }

    //页面事件初始化
    function initEvent(user){
        vm = new Vue({
            el: '#user',
            data: {
                name:"",
                company:"",
                email:""
            },
            mounted: function () {
            },
            methods:{
                submit:submit
                
            }
        });

        getUserInfo();

        function submit(){
            var userInfo = vm.userInfo;
            $.post("/userCenter/saveUserInfo",{userInfo:userInfo},function(result){
                if(!result.success){
                    console.log(result.message);
                }
                location.href = "/userCenter/index";
            });
        }
    }

    return {
        init: init
    }
})(jQuery);