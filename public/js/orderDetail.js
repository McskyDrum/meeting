var OrderDetail = (function ($) {
    var orderInfo = {};
    function init(data) {
        /*重定义内容高度*/
        var wh = $(window).height();
        $('.container').css('min-height', wh - 63);
        initEvent(data);
    }

    //页面事件初始化
    function initEvent(data){
        var vm = new Vue({
            el: '#mInfo',
            data: data,
            methods:{
                'cancel':cancel,
                'open': open
            },
            filters: {
                cash:CashFilters,
                time:TimeFilters
            }
        });

        function CashFilters(money){
            return money/100;
        }

        function TimeFilters(time,format){
            var date = new Date(time);
            return moment(date).format(format);
        }

        function cancel(){
            $.post("/order/cancelOrder",{orderId:data.orderId},function(result){
                if(!result.success){
                    $.wiseinfo({content:result.message});
                    return;
                }
                location.reload();
            });
        }

        function open() {
            $.post("/order/openMeetRoom",{orderId:data.orderId},function(result){
                if(!result.success){
                    $.wiseinfo({content:result.message});
                }else{
                    $.wiseinfo({content:"开锁成功"});
                }
            });
        }
    }

    return {
        init: init
    }
})(jQuery);