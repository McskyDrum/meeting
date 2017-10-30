var express = require('express');
var router = express.Router();

var Building1 = {
    'id': 1,
    'name':"��������MALL���ſ͹���"
};
var Building2 = {
    'id': 2,
    'name':"��������MALL���ſ͹���"
};
var Building3 = {
    'id': 3,
    'name':"��������MALL���ſ͹���"
};
var Building4 = {
    'id': 4,
    'name':"��������MALL���ſ͹���"
};
var Building5 = {
    'id': 5,
    'name':"��������MALL���ſ͹���"
};

var BuildingForCitys = [
    {cityName:"����",meetingList:[Building1,Building2,Building3]},
    {cityName:"�Ϻ�",meetingList:[Building4,Building5]}
]

/* GET home page. */
router.get('/loadAllBuilding', function(req, res, next) {
    var data = {success:true};
    data.list = BuildingForCitys;
    res.send(data);
    //res.render('index', { title: 'Express',array:array });
});


var ReserveMeetingRoom = {
    id:1234,
    img:"https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg",
    roomName:"����������",
    headcount:8,
    price:20000,
    openTimeStart:1508518080000,//  ���ŵ���ʼʱ��
    openTimeEnd:1508525280000,//  ���ŵĽ���ʱ��
    allTimeListCount:4,
    canReserveList:[1,2]
};

/* GET home page. */
router.get('/loadMeetingList', function(req, res, next) {
    var data = {success:true};
    data.list = [ReserveMeetingRoom,ReserveMeetingRoom,ReserveMeetingRoom];
    res.send(data);
    //res.render('index', { title: 'Express',array:array });
});


module.exports = router;