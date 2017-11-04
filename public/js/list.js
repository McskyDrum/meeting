var MeetingList = (function ($) {

    Array.prototype.contains = function(item){
        for(var index in this){
            if(this[index]==item){
                return true;
            }
        }
        return false;
    };

    var vm = {};
    var buildingService = new BuildingService();
    var timeStap = 30;




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
        var now = lowTime(cfg.now);

        var data = {};
        data.ads = ads;

        data.rooms = [];    //会议室数组
        data.operaIndex = -1; //当前正在操作的会议室序号

        data.building = {id:buildingId,name:"请选择"};
        data.setDay = now;   //选择用来筛选的日期
        data.setDayElse = false;    //是否通过其他日期来选择的
        data.today = now;    //今天的日期 ‘2017-10-24’
        data.tomorrow = now+24*3600*1000; //明天的日期

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
                        _this.setDay = new Date(e.valueText.replace(/\//g,'-')+" 00:00").getTime();
                        _this.setDayElse = true;
                        _this.getMeetings();
                    }
                });

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
                    vm.operaIndex = -1;
                    $.get("/building/loadMeetingList?buildingId="+_this.building.id+"&time="+_this.setDay,function(result){
                        if(result.success){
                            vm.resetRoomData(result.list);
                        }
                    });
                },
                resetRoomData :resetRoomData,
                'reserve' : function(index){    //预约当前会议室
                    var room = vm.rooms[index];
                    var timeNum = room.timeNum;
                    if(timeNum==0){
                        return;
                    }
                    var timeArray = room.timeArray;
                    var fristIndex = findFristIndex(timeArray);

                    var startTime = room.openTimeStart + timeStap*fristIndex*60000;
                    var endTime = startTime+timeNum*timeStap*60000;
                    location.href = "/building/submitMeetingRoom?meetingRoomId="+room.id+"&startTime="+startTime+"&endTime="+endTime
                },
                'rollLeft' : function(index){
                    var leftDis = parseInt(this.rooms[index].leftDis);
                    var n = parseInt(($(window).width() - 66) / 42);
                    n = n > 6 ? 6 : n;
                    leftDis = leftDis + (42*n);
                    leftDis = leftDis > 0 ? 0 : leftDis;
                    this.rooms[index].leftDis = leftDis;
                },
                'rollRight' : function(index){
                    var maxWidth = this.rooms[index].allTimeListCount * 42;
                    var leftDis = parseInt(this.rooms[index].leftDis);
                    var n = parseInt(($(window).width() - 66) / 42);
                    var maxleft = maxWidth - $(window).width() + 66;
                    n = n > 6 ? 6 : n;
                    leftDis = leftDis - (42*n);
                    leftDis = leftDis < -maxleft ? -maxleft : leftDis;
                    this.rooms[index].leftDis = leftDis;
                },
                checkTime:checkTime,
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
                preventClose:preventClose,
                timeCompFilter:timeCompFilter,
                showTimeRend:showTimeRend
            },
            filters: {
                cash:CashFilters,
                time:TimeFilters
            }
        });


        function CashFilters(money){
            return money/100;
        }

        function timeCompFilter(index,time){
            if(index%2==0){
                var date = new Date(time);
                return (date.getHours()+index / 2)+"时";
            }else{
                return "";
            }
        }

        function lowTime(time) {
            var date = new Date(time);
            var m = date.getMinutes() >= timeStap ? timeStap : 0;
            date.setMinutes(m);
            date.setSeconds(0);
            return date.getTime();
        }

        function TimeFilters(time,format){
            var data = new Date(time);
            return moment(data).format(format);
        }

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

        function resetRoomData(list){   //重置会议室时间数据
            list.forEach(function(item){
                var allTimeListCount = item.allTimeListCount;
                var canReserveList = item.canReserveList;
                item.openTimeStart = lowTime(item.openTimeStart);   //开始时间的数值
                item.timeArray = []; //-1 :disabled(不能选) 0:没有选 1:被选择
                item.timeNum = 0;
                item.fristClick = -1;
                for(var i=0;i<allTimeListCount;i++){
                    if(canReserveList.contains(i) && (item.openTimeStart+i*timeStap*60000>now)){
                        item.timeArray.push(0);
                    }else{
                        item.timeArray.push(-1);
                    }
                }
                item.leftDis = resetLeftDis(item);//第一个有效的时间段
            })
            this.rooms = list;
        }

        function resetLeftDis(item){
            var maxWidth = item.allTimeListCount * 42;
            var timeArray = item.timeArray;//找出第一个可以选择的序号

            var canSelectIndex = 0;
            for(var i in timeArray){
                if(timeArray!=-1){
                    canSelectIndex = i;
                    break;
                }
            }
            var leftDis = canSelectIndex > 0 ?  canSelectIndex* 42 : maxWidth;
            var maxleft = maxWidth - $(window).width() + 66;
            leftDis = leftDis > maxleft ? -maxleft : -leftDis;
            return leftDis;
        }

        /**
         * 选择时间段
         * 1.如果没有选,则选择当前时间段 ,做为第一个段
         * 2.如果当前有,则连接第一个段
         * 3.如果当前是第一个段,去除所有段
         * @param index
         * @param timeIndex
         * @returns {boolean}
         */
        function checkTime(index,timeIndex){
            var timeArray = vm.rooms[index].timeArray;
            var fristClick = vm.rooms[index].fristClick;
            if(timeArray[timeIndex]==-1){//无效时间端点击不起作用
                return;
            }
            if(vm.operaIndex !=index && vm.operaIndex!=-1){
                resetRoomData(vm.rooms);
            }
            vm.operaIndex = index;

            if(fristClick==-1){//第1种
                vm.rooms[index].fristClick = timeIndex;
                vm.rooms[index].timeArray[timeIndex]=1;
                vm.rooms[index].timeNum = 1;
                return;
            }

            var min = fristClick<timeIndex?fristClick:timeIndex;
            var max = fristClick>timeIndex?fristClick:timeIndex;
            if(fristClick==timeIndex){//第3种
                max = -1;
                vm.rooms[index].timeNum = 0;
                vm.rooms[index].fristClick = -1;
            }else{
                vm.rooms[index].timeNum = max - min +1;
            }
            var newList = [];
            timeArray.forEach(function(item,i){
                if(item==-1){
                    newList.push(-1);
                }else if(i>=min && max>=i){
                    newList.push(1);
                }else{
                    newList.push(0);
                }
            });
            vm.rooms[index].timeArray = newList;
        }

        function showTimeRend(index){
            var room = vm.rooms[index];
            var timeNum = room.timeNum;
            if(timeNum==0){
                return "";
            }
            var timeArray = room.timeArray;
            var fristIndex = findFristIndex(timeArray);

            var startTime = room.openTimeStart + timeStap*fristIndex*60000;
            var endTime = startTime+timeNum*timeStap*60000;

            return TimeFilters(startTime,"H:mm")+"-"+TimeFilters(endTime,"H:mm");




        }

    }

    function findFristIndex(timeArray){
        for(var i in timeArray){
            var item = timeArray[i];
            if(item==1){
                return i;
            }
        }
        return null;
    }

    return {
        init: init
    }
})(jQuery);