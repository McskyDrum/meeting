var Orders = (function ($) {

    var vm = {};
    vm.orders = [];

    var pageIndex = 1;
    function loadAllOrders(){
        if(pageIndex==-1){
            return;
        }
        $.get("/order/allOrders?pageIndex="+pageIndex,function(result){
            if(!result.success){
                return;
            }
            pageIndex = result.nextPageIndex;
            for(var order in result.orderList){
                vm.orders.push(order);
            }
        })
    }

    /**
     * 更新单个订单
     * @param index  orders的订单序号
     */
    function loadOneOrder(index) {
        var order = vm.orders[index];
        $.get("/order/loadOneOrder?id="+order.orderId,function(result){
            if(!result.success){
                return;
            }
            pageIndex = result.nextPageIndex;
            vm.orders[index] = result.order;
        })
    }

    /**
     * 获取待支付订单
     */
    function loadWaitPayOrder() {
        $.get("/order/waitPay",function(result){
            if(!result.success){
                return;
            }
            vm.orders = result.orderList;
        })
    }

    /**
     * 获取待使用的订单
     */
    function loadWaitUseOrder() {
        $.get("/order/waitUse",function(result){
            if(!result.success){
                return;
            }
            vm.orders = result.orderList;
        })
    }

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