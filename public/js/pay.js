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
                var myScroll = new IScroll('.modal-body');
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
                'checkCou' : function(cou){
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
        function submit(){

        }

    }

    return {
        init: init
    }
})(jQuery);