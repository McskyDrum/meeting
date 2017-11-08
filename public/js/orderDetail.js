var OrderDetail = (function ($) {
    var orderInfo = {};
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        $('.container').css('min-height', wh - 63);
        //获取会议室信息，更新meetInfo;
        orderInfo = {
            meetInfo : {
                'meetingRoomId': 1,
                'img' : 'https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg',
                'roomName' : '苍之风云1',
                'roomTitle' : '阿里巴巴创新中心·优客工场',
                'selectDate' : 1512000000000,
                'seletcTime' : '12:00-14:00',
                'address' : '北京市朝阳区酒仙桥路14号兆维工业园C3号楼2层',
                'endTime' : 1509789600000,
                'startTime' : 1509786000000,
                'headCount' : 8,
                'tel': '13900000000',
                'meetingTimeCount' : 2,
                'price' : 20000
            },
            'coupons' : [{
                'id': 1234,
                'couponPrice' : 2000,
                'basicPrice' : 20000,
                'couponName' : '满200减20',
                'timeStart' : 1512000000000,
                'timeEnd' : 1512000000000
            },{
                'id': 12345,
                'couponPrice' : 2000,
                'basicPrice' : 20000,
                'couponName' : '满200减20',
                'timeStart' : 1512000000000,
                'timeEnd' : 1512000000000
            }],
            'checkCoupon' : {
                'id': 12345,
                'couponPrice' : 2000,
                'basicPrice' : 20000,
                'couponName' : '满200减20',
                'timeStart' : 1512000000000,
                'timeEnd' : 1512000000000
            },
            'amountListlist' : [
                {
                    itemId:1,//long   商品Id
                    price:20000,//Integer 200元/量化单位
                    unitName:"个",//单位名称  String
                    goodName:"商品1",//String
                    num : 1
                }
            ],
            'operateType':["CAN_OPEN","CAN_TUIDING"],
            'total' : 0
        };
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        var vm = new Vue({
            el: '#mInfo',
            data: orderInfo,
            mounted: function () {
                this.calculate();
            },
            methods:{
                'calculate' : function(){
                    var extraM = 0;
                    this.amountListlist.forEach(function(item){
                        extraM = extraM + (item.price * item.num);
                    });
                    var couponM = this.checkCoupon.couponPrice ? this.checkCoupon.couponPrice : 0;
                    this.total = this.meetInfo.price * this.meetInfo.meetingTimeCount + extraM - couponM;
                },
                'cancel': function(){
                    //取消订单
                    console.log('cancel');
                },
                'quit': function(){
                    //退订
                    console.log('quit');
                },
                'open': function(){
                    //开锁
                    console.log('open');
                }
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
    }

    return {
        init: init
    }
})(jQuery);