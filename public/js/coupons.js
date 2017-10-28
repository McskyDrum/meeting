var Coupon = (function ($) {

    var vm = {};

    function TimeFilters(time){
        var data = new Date(time);
        return moment(data).format("YYYY-MM-DD");
    }

    function CashFilters(money){
        return money/100;
    }

    function init(fun) {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 45);

        initEvent(fun);
    }

    function goByType(type){
        vm.type = type;
        vm.coupons = [];
        loadCouponsByType(type);
    }

    /**
     * 加载优惠券数据
     * @param type
     */
    function loadCouponsByType(type){
        var status = {"can":1,"disable":2};
        $.get("/coupon/loadUserCoupon?status="+status[type],function(result){
            vm.coupons = result.couponList;
        });

    }

    //页面事件初始化
    function initEvent(type){
        var data = {};
        data.coupons = coupons;
        data.type = type;
        vm = new Vue({
            el: '#coupons',
            data: data,
            mounted: function () {
            },
            methods:{
                goByType:goByType
            },
            filters: {
                time:TimeFilters,
                cash:CashFilters
            }
        });
        loadCouponsByType(type);
    }

    return {
        init: init
    }
})(jQuery);