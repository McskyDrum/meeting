var Pay = (function ($) {
    var meetInfo = {};
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        $('.container').css('min-height', wh - 63);
        //获取会议室信息，更新meetInfo;
        meetInfo = {
            meetInfo : {
                'pic' : 'https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg',
                'meetingroomName' : '苍之风云1',
                'stageName' : '阿里巴巴创新中心·优客工场',
                'selectDate' : '2017/10/22 (周日)',
                'seletcTime' : '12:00-13:00 (1小时)',
                'workstageAddress' : '北京市朝阳区酒仙桥路14号兆维工业园C3号楼2层',
                'openEndTime' : "20:00",
                'openStartTime' : "10:00",
                'peopleNumber' : 8,
                'tel': '13900000000',
                'roomTotal' : 400,
                'roomPrice' : 200
            },
            'coupons' : [{
                'id': 1234,
                'basicPrice' : 20,
                'couponName' : '满200减20',
                'timesStart' : '2017/6/6',
                'timeEnd' : '2017/12/12'
            },{
                'id': 12345,
                'basicPrice' : 20,
                'couponName' : '满200减20',
                'timesStart' : '2017/6/6',
                'timeEnd' : '2017/12/12'
            }],
            'checkCoupon' : {},
            'addItem' : [
                {
                    'name' : '台签',
                    'price' : '5',
                    'num' : 0
                }
            ],
            'total' : 0
        }
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        var vm = new Vue({
            el: '#mInfo',
            data: meetInfo,
            mounted: function () {
                var myScroll = new IScroll('.modal-body');
                this.total = this.meetInfo.roomTotal;
            },
            methods:{
                'calculate' : function(){
                    var extraM = 0;
                    this.addItem.forEach(function(item){
                        extraM = extraM + (item.price * item.num);
                    })
                    var couponM = this.checkCoupon.basicPrice ? this.checkCoupon.basicPrice : 0;
                    this.total = this.meetInfo.roomTotal + extraM - couponM;
                },
                'addNum' : function(index){
                    this.addItem[index].num++;
                    this.calculate();
                },
                'delNum' : function(index){
                    this.addItem[index].num--;
                    var gdNum = this.addItem[index].num;
                    this.addItem[index].num = gdNum > 0 ? gdNum : 0;
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
                        this.checkCoupon = cou;
                    }
                    this.calculate();
                    return false;
                },
                'submit': function(){
                    //提交订单
                }
            }
        })
    }

    return {
        init: init
    }
})(jQuery);