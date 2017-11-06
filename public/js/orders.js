var Orders = (function ($) {

    var vm = {};

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
    var loading = false;
    function loadAllOrders(){
        loading = true;
        if(vm.pageIndex==-1){
            //不能加载更多
            return;
        }
        $.get("/order/allOrders?pageIndex="+vm.pageIndex,function(result){
            if(!result.success){
                loading = false;
                return;
            }
            vm.pageIndex = result.nextPageIndex;
            for(index in result.orderList){
                vm.orders.push(result.orderList[index]);
            }
            loading = false;
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
        initEvent(type);
    }

    function goByType(type){
        if(vm.type == type){
            return;
        }
        vm.type = type;
        vm.orders = [];
        if(type=="all"){
            vm.pageIndex = 1;
            loadAllOrders();
        }
        if(type=="waitPay"){
            vm.pageIndex = -1;
            loadWaitPayOrder();
        }
        if(type=="waitUse"){
            vm.pageIndex = -1;
            loadWaitUseOrder();
        }
    }

    function hasOperate(index,operate){
        var operateTypes = vm.orders[index].operateType;
        for (var i in operateTypes) {
            if (operateTypes[i] == operate) return true;
        }
        return false;
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    //页面事件初始化
    function initEvent(type){

        var data = {};
        data.orders = [];
        data.type = type;
        data.pageIndex = 1;
        vm = new Vue({
            el: '#orders',
            data: data,
            mounted: function () {
                var _this = this;
                if(type == 'all'){
                    $(window).scroll(function () {
                        //console.log($("#goodsListContainer").scrollTop(), $(window).height(),getDocHeight(),$(".js-footer").offset().top );
                        if (($(window).scrollTop() + $(window).height() >= (getDocHeight() - 100)) && !loading) {
                            _this.loadAllOrders();
                        }
                    });
                }

                _this.goByType(type);
            },
            methods:{
                goByType:goByType,
                loadAllOrders:loadAllOrders,//下拉刷新
                hasOperate:hasOperate
            },
            filters: {
                time:TimeFilters,
                cash:CashFilters
            }
        });
    }

    return {
        init: init
    }
})(jQuery);