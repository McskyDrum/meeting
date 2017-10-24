var List = (function ($) {
    var stageList = [{
        'cityName' : '北京市',
        'stageList' : [{
            'id' : 10091,
            'stageName' : "望京凯德MALL·优客工场",
            'stageNameEn' : "Wangjing Kaide MALL·UR WORK"
        },{
            'id' : 10088,
            'stageName' : "鸿坤·优客工场",
            'stageNameEn' : "Urwork Beijing hongkun community"
        }]
    },{
        'cityName' : '上海市',
        'stageList' : [{
            'id' : 10096,
            'stageName' : "歌斐中心·优客工场",
            'stageNameEn' : "Gopher Center · Urwork"
        },{
            'id' : 10071,
            'stageName' : "金陵大厦·优客工场",
            'stageNameEn' : "Jinling Building·UR WORK"
        }]
    }];
    var stageCheck = reCheck = {
        'id' : 10091,
        'stageName' : "望京凯德MALL·优客工场",
        'stageNameEn' : "Wangjing Kaide MALL·UR WORK"
    };
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 90);

        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        var data = {};
        data.rooms = [];    //会议室数组
        data.stageInfo = stageList; //大厦数组
        data.stageCheck = stageCheck;   //选择的大厦obj
        data.reCheck = reCheck; //预选大厦obj，在不按确认按钮时保存的大厦obj
        data.setDay = '';   //选择用来筛选的日期
        data.setDayElse = false;    //是否通过其他日期来选择的
        data.today = '';    //今天的日期 ‘2017-10-24’
        data.tomorrow = ''; //明天的日期
        var vm = new Vue({
            el: '#meetingList',
            data: data,
            mounted: function () {
                var _this = this;
                var myScroll = new IScroll('.modal-body');

                //其他日期选择
                mobiscroll.date('#mobiscroll', {
                    buttons: ['cancel','set'],
                    circular: [false,false,false],
                    display: 'center',
                    dateWheels: 'yy mm dd',
                    lang: 'zh',
                    min: new Date(),
                    theme: 'android-holo',
                    onSet: function(e){
                        _this.setDay = e.valueText.replace(/\//g,'-');
                        _this.setDayElse = true;
                        _this.getMeetings();
                    }
                });

                _this.resetDate();
                this.getMeetings();
            },
            updated: function(){
                $(".js-lazy").scrollLoading();
            },
            methods:{
                'getMeetings' : function(){ //获取会议室列表
                    var _this = this;
                    var roomList = [{
                        'id' : 19820608,
                        'roomName' : '苍之风云',
                        'openTimeStart' : '10:00',
                        'openTimeEnd' : '20:00',
                        'headcount' : 8,
                        'img' : 'https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg',
                        'price' : 50,
                        'allTimeListCount': 20,
                        'canReserveList': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
                    }];
                    _this.resetRoomData(roomList);
                    // $.ajax({
                    //     type: "post",
                    //     url: API_URL + "api/getMeetings",
                    //     dataType: 'json',
                    //     data: {
                    //         'plantId' : _this.stageCheck.id,
                    //         'date' : _this.setDay
                    //     },
                    //     isLoading: true,
                    //     success: function (result) {
                    //         _this.rooms = result.data;
                    //     }
                    // });
                },
                'resetRoomData' : function(list){   //重置会议室时间数据
                    var _this = this;
                    list.forEach(function(item){
                        item.timeArr = new Array(item.allTimeListCount);
                        item.startNum = parseInt(item.openTimeStart);   //开始时间的数值
                        item.checkArr = []; //选取的时间数组
                        item.cTimeStr = '';
                        item.CTimeNum = 0;
                        item.cfirst = '';   //第一个选择的时间

                        //如果选中的日期是今天,重置有效选择数值canReserveList
                        (_this.setDay == _this.today)&&(new Date().getHours()>=item.startNum)&&(item.canReserveList = _this.resetCanTArr(item));
                    })
                    this.rooms = list;
                },
                'reserve' : function(index){    //预约当前会议室
                    var roomInfo = this.rooms[index];
                },
                'resetCanTArr' : function(item){
                    //获取当前时间
                    var date = new Date();
                    var h = date.getHours();
                    var m = date.getMinutes() > 30 ? 2 : 1;
                    var max = (h - item.startNum) * 2 + m;
                    var arr = [];
                    item.canReserveList.forEach(function(item){
                        (item>=max) && (arr.push(item));
                    })
                    return arr;
                },
                'checkTime' : function(index,t){   //时间段选取
                    if(this.rooms[index].canReserveList.indexOf(t) < 0){
                        return false;
                    }else{
                        if(this.rooms[index].cfirst == ''){
                            this.rooms[index].cfirst = t;
                            this.rooms[index].checkArr.push(t);
                        }else{
                            if(this.rooms[index].cfirst == t){
                                this.rooms[index].cfirst='';
                                this.rooms[index].checkArr=[];
                            }else if(t > this.rooms[index].cfirst){
                                //判断选中是否含有不可选的时间段
                                var isvalid = true,cArr = [];
                                for(var x = this.rooms[index].cfirst; x<=t; x++){
                                    if(this.rooms[index].canReserveList.indexOf(x) < 0){
                                        isvalid = false;
                                        return false;
                                    }
                                    cArr.push(x);
                                }
                                (isvalid)&&(this.rooms[index].checkArr = cArr)
                            }else{
                                //判断选中是否含有不可选的时间段
                                var isvalid = true,cArr = [];
                                for(var x = t; x<=this.rooms[index].cfirst; x++){
                                    if(this.rooms[index].canReserveList.indexOf(x) < 0){
                                        isvalid = false;
                                        return false;
                                    }
                                    cArr.push(x);
                                }
                                (isvalid)&&(this.rooms[index].checkArr = cArr)
                            }
                        }
                    }
                    this.calCheckTime(index);
                },
                'calCheckTime' : function(index){    //计算选择时间段
                    if(this.rooms[index].checkArr.length <=0){
                        this.rooms[index].CTimeNum = 0;
                        this.rooms[index].cTimeStr = '';
                        return false;
                    }
                    var hours = this.rooms[index].checkArr.length / 2;
                    this.rooms[index].CTimeNum = hours.toFixed(1);

                    var sNum = this.rooms[index].startNum;  //开始时间的数值
                    var len = this.rooms[index].checkArr.length;
                    var cStart = this.rooms[index].checkArr[0];
                    var csNum = parseInt(cStart / 2);
                    var csStr = (cStart%2==0) ? (sNum + csNum) + ':00' : (sNum + csNum) + ':30';

                    var cEnd = this.rooms[index].checkArr[len-1]
                    var ceNum = parseInt(cEnd / 2);
                    var ceStr = (cStart%2!=0) ? (sNum + ceNum) + ':00' : (sNum + ceNum) + ':30';

                    this.rooms[index].cTimeStr = csStr + '-' + ceStr;
                },
                'resetDate' : function(){
                    //获取当前日期
                    var date = new Date();
                    var year = date.getFullYear();
                    var mouth = date.getMonth() +1;
                    var day = date.getDate();
                    var today = year + '-' + mouth + '-' + day;

                    date.setDate(day + 1);
                    var y = date.getFullYear();
                    var m = date.getMonth() +1;
                    var d = date.getDate();
                    var tomorrow = y + '-' + m + '-' + d;

                    this.today = today;
                    this.tomorrow = tomorrow;
                    this.setDay = today;
                },
                'setDate': function(day){
                    //选择今天或明天
                    this.setDay = day;
                    this.setDayElse = false;
                    $('#mobiscroll').val('');
                    this.getMeetings();
                },
                'closeStage' : function(){  //关闭大厦选择弹窗
                    $('#plantIdModal').add('.modal-backdrop').removeClass('in');
                    $('body').removeClass('modal-open');
                    return false;
                },
                'showStage' : function(){   //开启大厦弹窗
                    $('#plantIdModal').add('.modal-backdrop').addClass('in');
                    $('body').addClass('modal-open');
                },
                'preventClose' : function(e){
                    e.stopPropagation();
                    return false;
                },
                'checkStage' : function(stage){
                    this.reCheck = stage;
                },
                'saveStage' : function(){
                    //保存数据并刷新会议列表
                    this.stageCheck = this.reCheck;
                    this.getMeetings();
                    this.closeStage();
                }
            }
        })
    }

    return {
        init: init
    }
})(jQuery);