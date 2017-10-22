var Pay = (function ($) {
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        $('.container').css('min-height', wh - 63);
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        var meetInfo = {
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
                'couponCode': 1234,
                'price' : 20,
                'strType' : '满200减20',
                'startDate' : '2017/6/6',
                'endDate' : '2017/12/12',
                'remark' : ''
            }],
            'addItem' : [
                {
                    'name' : '台签',
                    'price' : '5',
                    'num' : 0
                }
            ]
        }
        var vm = new Vue({
            el: '#mInfo',
            data: meetInfo,
            mounted: function () {
            },
            methods:{
                'addNum' : function(index){
                    this.addItem[index].num++;
                },
                'delNum' : function(index){
                    this.addItem[index].num--;
                    var gdNum = this.addItem[index].num;
                    this.addItem[index].num = gdNum > 0 ? gdNum : 0;
                }
            }
        })
    }

    return {
        init: init
    }
})(jQuery);