var Orders = (function ($) {

    var vm = {};
    vm.orders = [];

    function TimeFilters(time,format){
        var data = new Date(time);
        return moment(data).format(format);
    }

    function CashFilters(money){
        return money/100;
    }

    /**
     * 分页加载全部订单
     * @type {number}
     */
    var pageIndex = 1;
    function loadAllOrders(){
        if(pageIndex==-1){
            //不能加载更多
            return;
        }
        $.get("/order/allOrders?pageIndex="+pageIndex,function(result){
            if(!result.success){
                return;
            }
            pageIndex = result.nextPageIndex;
            for(var order in result.orderList){
                console.log(order);
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

    function init(type) {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 45);

        console.log("haha");
        initEvent(type);
    }

    function goByType(type){
        if(vm.type == type){
            return;
        }
        vm.type = type;
        if(type=="all"){
            pageIndex = 1;
            loadAllOrders();
        }
        if(type=="waitPay"){
            pageIndex = -1;
            loadWaitPayOrder();
        }
        if(type=="waitUse"){
            pageIndex = -1;
            loadWaitUseOrder();
        }
    }

    //页面事件初始化
    function initEvent(type){

        var data = {};
        data.orders = [];
        data.type = "";
        vm = new Vue({
            el: '#orders',
            data: data,
            mounted: function () {

            },
            methods:{
                goByType:goByType,
                loadAllOrders:loadAllOrders//下拉刷新
            },
            filters: {
                time:TimeFilters,
                cash:CashFilters
            }
        });
        goByType(type);
    }

    return {
        init: init
    }
})(jQuery);