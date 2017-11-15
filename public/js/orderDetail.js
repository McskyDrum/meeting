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
                'open': open,
                pay:pay
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

        var lock = false;
        function pay(){
            if(lock){
                return;
            }
            lock = true;
            $.post("/order/continuePay",{orderId:data.orderId},function(result){
                if(!result.success){
                    $.wiseinfo({content:result.message});
                    lock = false;
                    return;
                }
                //调用微信支付
                var payInfo = result.payInfo;
                weixinPay(result.orderId,payInfo,CallBack);

                function CallBack(orderId,statue,message){
                    $.wiseinfo({content:message,delay:1500});
                    lock = false;
                    if(statue){
                        setTimeout(function(){
                            location.href = "/order/orderDetails?orderId="+orderId;
                        },1500)
                    }
                }
            });
        }

        function weixinPay(orderId,payInfo,callback){
            function onBridgeReady(){
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',payInfo,
                    function(res){
                        if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                            callback.call(this,orderId,true,"支付成功");
                        }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                            callback.call(this,orderId,false,"取消支付");
                        }else if(res.err_msg == "get_brand_wcpay_request:fail"){
                            callback.call(this,orderId,false,"支付失败");
                        }
                    }
                );
            }
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            }else{
                onBridgeReady();
            }
        }

    }

    return {
        init: init
    }
})(jQuery);