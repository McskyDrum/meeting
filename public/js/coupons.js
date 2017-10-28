var Coupon = (function ($) {
    var coupons = []
    var delObj = {
        'can' : function(){ //获取有效
            coupons = [
                {
                    'id': 1234,
                    'basicPrice' : 20,
                    'limit': 200,
                    'couponName' : '满200减20',
                    'timesStart' : '2017/6/6',
                    'timeEnd' : '2017/12/12'
                },{
                    'id': 12345,
                    'basicPrice' : 20,
                    'limit': 0,
                    'couponName' : '满200减20',
                    'timesStart' : '2017/6/6',
                    'timeEnd' : '2017/12/12'
                }
            ];
            initEvent('can');
        },
        'disable': function(){  //获取无效
            coupons = [
                {
                    'id': 1234,
                    'basicPrice' : 20,
                    'limit': 200,
                    'couponName' : '满200减20',
                    'timesStart' : '2017/6/6',
                    'timeEnd' : '2017/12/12'
                },{
                    'id': 12345,
                    'basicPrice' : 20,
                    'limit': 0,
                    'couponName' : '满200减20',
                    'timesStart' : '2017/6/6',
                    'timeEnd' : '2017/12/12'
                }
            ];
            initEvent('disable');
        }
    }
    function init(fun) {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 45);
        delObj[fun]();
    }

    //页面事件初始化
    function initEvent(type){
        var data = {};
        data.coupons = coupons;
        data.type = type;
        var vm = new Vue({
            el: '#coupons',
            data: data,
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