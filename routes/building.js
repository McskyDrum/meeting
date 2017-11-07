var express = require('express');
var router = express.Router();

var Building1 = {
    'id': 1,
    'name':"1望京凯德MALL·优客工场1"
};
var Building2 = {
    'id': 2,
    'name':"2望京凯德MALL·优客工场2"
};
var Building3 = {
    'id': 3,
    'name':"3望京凯德MALL·优客工场3"
};
var Building4 = {
    'id': 4,
    'name':"4望京凯德MALL·优客工场4"
};
var Building5 = {
    'id': 5,
    'name':"5望京凯德MALL·优客工场5"
};

var BuildingForCitys = [
    {cityName:"北京",buildingList:[Building1,Building2,Building3]},
    {cityName:"上海",buildingList:[Building4,Building5]},
    {cityName:"上海",buildingList:[Building4,Building5]},
    {cityName:"上海",buildingList:[Building4,Building5]},
    {cityName:"上海",buildingList:[Building4,Building5]},
    {cityName:"上海",buildingList:[Building4,Building5]},
    {cityName:"上海",buildingList:[Building4,Building5]},
    {cityName:"上海",buildingList:[Building4,Building5]}
]

/* GET home page. */
router.get('/loadAllBuilding', function(req, res, next) {
    var data = {success:true};
    data.list = BuildingForCitys;
    res.send(data);
});


var ReserveMeetingRoom = {
    id:1234,
    img:"https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg",
    roomName:"望京凯德MALL·优客工场3",
    headcount:8,
    price:20000,
    openTimeStart:1509753600000,//  ���ŵ���ʼʱ��
    openTimeEnd:1509796800000,//  ���ŵĽ���ʱ��
    allTimeListCount:24,
    canReserveList:[16,17,18,19,20]
};

/* GET home page. */
router.get('/loadMeetingList', function(req, res, next) {
    var data = {success:true};
    data.list = [ReserveMeetingRoom,ReserveMeetingRoom,ReserveMeetingRoom];
    res.send(data);
    //res.render('index', { title: 'Express',array:array });
});


module.exports = router;