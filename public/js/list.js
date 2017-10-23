var List = (function ($) {
    var defaultList = {};
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
        data.meetings = defaultList;
        data.stageInfo = stageList;
        data.stageCheck = stageCheck;
        data.reCheck = reCheck;
        data.setDay = '';
        data.setDayElse = false;
        data.today = '';
        data.tomorrow = '';
        var vm = new Vue({
            el: '#meetingList',
            data: data,
            mounted: function () {
                var _this = this;
                var myScroll = new IScroll('.modal-body');
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
                        this.getMeetings();
                    }
                });

                $(".js-lazy").scrollLoading();
                this.resetDate();
                //this.getMeetings();
            },
            methods:{
                'getMeetings' : function(){
                    var _this = this;
                    $.ajax({
                        type: "post",
                        url: API_URL + "api/getMeetings",
                        dataType: 'json',
                        data: {
                            'plantId' : _this.stageCheck.id,
                            'date' : _this.setDay
                        },
                        isLoading: true,
                        success: function (result) {
                            if (!result.success) {
                                initEvent();
                                console.log(result.error.message);
                                return false;
                            } else {
                                initEvent();
                            }
                        }
                    });
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
                'closeStage' : function(){
                    $('#plantIdModal').add('.modal-backdrop').removeClass('in');
                    $('body').removeClass('modal-open');
                    return false;
                },
                'showStage' : function(){
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