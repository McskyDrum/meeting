var MeetingList = (function ($) {

    var vm = {};
    var buildingService = new BuildingService();


    function BuildingService(){
        var buildingId = null;
        var buildingList = [];

        return {
            setBuildingId:setBuildingId,
            getCurrentBuilding:getCurrentBuilding,
            loadBuildings:loadBuildings
        }

        function setBuildingId(id){
            buildingId = id;
        }

        function getCurrentBuilding(callback,obj){
            var _this = !!obj?obj:callback;
            if(!buildingId){
                callback.call(_this,{'name':"请选择"})
            }
            findBuilding(buildingId,callback);
        }

        function findBuilding(id,callback){
            loadBuildings(function(buildingList){
                for(var index in buildingList){
                    var building = buildingList[index];
                    if(building.id == id){
                        callback.call(this,building);
                        return;
                    }
                }
            })
        }

        /**
         * 加载园区列表
         */
        function loadBuildings(callback){
            if(buildingList.length!=0){
                callback.call(this,buildingList);
                return;
            }
            $.get("/building/loadAllBuilding",function(result){
                if(!result.success){
                    return;
                }
                var newList = [];
                for(var index in result.list){
                    var building = result.list[index];
                    newList.push({name:building.cityName});
                    for(var index2 in building.buildingList){
                        var build = building.buildingList[index2];
                        newList.push({name:build.name,id:build.id});
                    }
                }
                buildingList = newList;
                callback.call(this,newList);
            });
        }
    }

    var ads = [{
        'href' : '',
        'img' : 'https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg'
    },{
        'href' : '',
        'img' : 'https://image.urwork.cn/d77acf90-a1de-44b2-81ef-25ea3d23f8c4.jpg'
    }];

    function init(cfg) {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh - 90);

        buildingService.setBuildingId(cfg.buildingId);
        initEvent(cfg);
    }


    //页面事件初始化
    function initEvent(cfg){
        var buildingId = cfg.buildingId;
        var now = cfg.now;

        var data = {};
        data.ads = ads;
        data.rooms = [];    //会议室数组
        data.building = {id:buildingId,name:"请选择"};
        data.setDay = 0;   //选择用来筛选的日期
        data.setDayElse = false;    //是否通过其他日期来选择的
        data.today = 0;    //今天的日期 ‘2017-10-24’
        data.tomorrow = 1; //明天的日期

        data.cherkId = cfg.buildingId;
        data.isOpen = false;
        data.buildingList = [];

        vm = new Vue({
            el: '#meetingList',
            data: data,
            mounted: function () {
                var _this = this;

                buildingService.getCurrentBuilding(function(building){
                    _this.building = building;
                });

                buildingService.loadBuildings(function(list){
                    vm.buildingList = list;
                });

                var myScroll = new IScroll('.modal-body');
                var swiper = new Swiper('.swiper-container', {
                    autoplay: 5000,
                    autoplayDisableOnInteraction: false,
                    loop: true,
                    speed: 1000,
                    pagination: '.swiper-container .swiper-pagination'
                });

                //其他日期选择
                mobiscroll.date('#mobiscroll', {
                    buttons: ['cancel','set'],
                    circular: [false,false,false],
                    display: 'center',
                    dateWheels: 'yy mm dd',
                    lang: 'zh',
                    min: new Date(now),
                    theme: 'android-holo',
                    onSet: function(e){
                        _this.setDay = e.valueText.replace(/\//g,'-');
                        _this.setDayElse = true;
                        _this.getMeetings();
                    }
                });

                _this.resetDate();
                _this.getMeetings();
            },
            updated: function(){
                $(".js-lazy").scrollLoading();
            },
            methods:{
                'getMeetings' : function(){ //获取会议室列表
                    var _this = this;
                    if(!_this.building.id || !_this.setDay){
                        return;
                    }
                    $.get("/building/loadMeetingList?buildingId="+_this.building.id+"&time="+_this.setDay,function(result){
                        if(result.success){
                            vm.resetRoomData(result.list);
                        }
                    });
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
                        item.leftDis = 0;//第一个有效的时间段

                        //如果选中的日期是今天,重置有效选择数值canReserveList
                        (_this.setDay == _this.today)&&(new Date().getHours()>=item.startNum)&&(item.canReserveList = _this.resetCanTArr(item));
                        item.leftDis = _this.resetLeftDis(item);
                    })
                    this.rooms = list;
                },
                'reserve' : function(index){    //预约当前会议室
                    var roomInfo = this.rooms[index];
                },
                'resetCanTArr' : function(item){
                    //获取当前时间
                    var date = new Date();
                    date.setTime(now);
                    var h = date.getHours();
                    var m = date.getMinutes() > 30 ? 2 : 1;
                    var max = (h - item.startNum) * 2 + m;
                    var arr = [];
                    item.canReserveList.forEach(function(item){
                        (item>=max) && (arr.push(item));
                    })
                    return arr;
                },
                'resetLeftDis' : function(item){
                    var maxWidth = item.allTimeListCount * 42;
                    var leftDis = item.canReserveList.length>0 ?  item.canReserveList[0]* 42 : maxWidth;
                    var maxleft = maxWidth - $(window).width() + 66;
                    leftDis = leftDis > maxleft ? -maxleft : -leftDis;
                    return leftDis + 'px';
                },
                'rollLeft' : function(index){
                    var leftDis = parseInt(this.rooms[index].leftDis);
                    var n = parseInt(($(window).width() - 66) / 42);
                    n = n > 6 ? 6 : n;
                    leftDis = leftDis + (42*n);
                    leftDis = leftDis > 0 ? 0 : leftDis;
                    this.rooms[index].leftDis = leftDis + 'px';
                },
                'rollRight' : function(index){
                    var maxWidth = this.rooms[index].allTimeListCount * 42;
                    var leftDis = parseInt(this.rooms[index].leftDis);
                    var n = parseInt(($(window).width() - 66) / 42);
                    var maxleft = maxWidth - $(window).width() + 66;
                    n = n > 6 ? 6 : n;
                    leftDis = leftDis - (42*n);
                    leftDis = leftDis < -maxleft ? -maxleft : leftDis;
                    this.rooms[index].leftDis = leftDis + 'px';
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
                    date.setTime(now);
                    var day = date.getDate();
                    this.today = date.getTime();
                    date.setDate(day + 1);
                    this.tomorrow = date.getTime();
                    this.setDay = this.today;
                },
                'setDate': function(time){
                    //选择今天或明天
                    this.setDay = time;
                    this.setDayElse = false;
                    $('#mobiscroll').val('');
                    this.getMeetings();
                },
                'showStage' : function(){   //开启大厦弹窗
                    vm.isOpen = true;
                    $('body').addClass('modal-open');
                },
                closeStage:closeStage,
                checkStage:checkStage,
                saveStage:saveStage,
                preventClose:preventClose
            }
        });


        /**
         * 关闭园区选择框
         */
        function closeStage(){
            vm.isOpen = false;
            $('body').removeClass('modal-open');
        }

        /**
         * 选择园区
         * @param index
         */
        function checkStage(index){
            var building = vm.buildingList[index];
            if(!building.id){
                return;
            }
            vm.cherkId = building.id;
        }

        /**
         * 保存园区
         */
        function saveStage(){
            //保存数据并刷新会议列表
            buildingService.setBuildingId(vm.cherkId);
            buildingService.getCurrentBuilding(function(building){
                vm.building = building;
                vm.getMeetings();
            });
            closeStage();
        }

        function preventClose(e){
            e.stopPropagation();
            return false;
        }
    }

    return {
        init: init
    }
})(jQuery);