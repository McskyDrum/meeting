var Pay = (function ($) {
    var meetInfo = {};
    function init(data) {
        /*重定义内容高度*/
        var wh = $(window).height();
        $('.container').css('min-height', wh - 63);
        //获取会议室信息，更新meetInfo;
        meetInfo = {
            meetInfo : {
                'meetingRoomId': data.meetingRoomId,
                'img' : data.roomImg,
                'roomName' : data.roomName,
                'roomTitle' : data.roomTitle,
                'address' : data.address,
                'endTime' : data.endTime,
                startTime : data.startTime,
                openStartTime:data.openStartTime,//会议室开放的开始时间
                openEndTime:data.openEndTime,//会议室开放的结束时间
                'headCount' : data.headCount,
                'tel': data.phoneNum,
                'meetingTimeCount' : data.meetingTimeCount,
                'price' : data.price,
                peopleName:data.peopleName,
                remark:data.remark
            },
            'coupons' : data.couponList,
            'checkCoupon' : {},
            'amountList' : data.amountList,
            'total' : 0
        };

        meetInfo.amountList.forEach(function(good){
            good.num = 0;
        });
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        var vm = new Vue({
            el: '#mInfo',
            data: meetInfo,
            mounted: function () {
                //var myScroll = new IScroll('.modal-body');
                this.total = this.meetInfo.price * this.meetInfo.meetingTimeCount;
            },
            methods:{
                'calculate' : function(){
                    var extraM = 0;
                    this.amountList.forEach(function(item){
                        extraM = extraM + (item.price * item.num);
                    });
                    var couponM = this.checkCoupon.couponPrice ? this.checkCoupon.couponPrice : 0;
                    this.total = this.meetInfo.price * this.meetInfo.meetingTimeCount + extraM - couponM;
                },
                'addNum' : function(index){
                    this.amountList[index].num++;
                    this.checkCoupon = {};
                    this.calculate();
                },
                'delNum' : function(index){
                    this.amountList[index].num--;
                    var gdNum = this.amountList[index].num;
                    this.amountList[index].num = gdNum > 0 ? gdNum : 0;
                    this.checkCoupon = {};
                    this.calculate();
                },
                'closeCoupon' : function(){
                    $('#couponsModal').add('.modal-backdrop').removeClass('in');
                    $('body').removeClass('modal-open');
                    return false;
                },
                'showCoupon' : function(){
                    $('#couponsModal').add('.modal-backdrop').addClass('in');
                    $('body').addClass('modal-open');
                },
                'preventClose' : function(e){
                    e.stopPropagation();
                    return false;
                },
                checkCou: function(cou){
                    console.log(cou);
                    if(cou.id == this.checkCoupon.id){
                        this.checkCoupon = {};
                    }else{
                        if(this.total<cou.basicPrice){
                            return false;
                        }
                        this.checkCoupon = cou;
                    }
                    this.calculate();
                    return false;
                },
                submit:submit
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
            var data = new Date(time);
            return moment(data).format(format);
        }

        /**
         * 提交订单
         */
        var lock = false;

        function submit(){
            if(lock){
                return;
            }
            var request = {};
            request.meetingRoomId = vm.meetInfo.meetingRoomId;
            request.endTime = vm.meetInfo.endTime;
            request.startTime = vm.meetInfo.startTime;
            request.amountList = vm.amountList;
            request.couponIds = [];
            if(!vm.checkCoupon.id){
                request.couponIds.push(vm.checkCoupon.id);
            }
            lock = true;
            $.post("/order/createOrder",request,function(result){
                if(!result.success){
                    console.log(result.message);
                }
                //调用微信支付
                var payInfo = result.payInfo;
                weixinPay(result.orderId,payInfo,CallBack);
            });

            function CallBack(orderId,statue,message){
                console.log(message);
                lock = false;
                if(statue){
                    setTimeout(function(){
                        location.href = "/order/orderDetails?orderId="+orderId;
                    },2000)
                }
            }
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