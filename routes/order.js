/**
 * Created by liuyao on 2017/10/28.
 */
var express = require('express');
var router = express.Router();

var Order = {
    orderId:17081811321372,//long
    roomNum:"12A+12B",//String 会议室编号
    orderTitle:"首都大厦，优客工厂",//String  订单主题
    orderStatus:"待支付",// String 订单状态文案
    meetingTimeStart:1508566101200, //Long  会议开始时间
    meetingTimeEnd:1508566101200,//Long 会议结束时间
    totalAmount:20000,//Integer 200.00元  订单总价格
    couponAmount:1000,//Integer 10.00元  优惠券
    realAmount:19000, //Integer 190.00元  订单实际支付金额
    meetingTimeCount:2, //Integer  2  订购的时长数  2个（半小时）即1小时
    bookingTime:1508566101200,//预定时间|订单创建时间
    operateType:["CAN_PAY","CAN_CANCEL","CANCELED","CAN_OPEN","CAN_TUIDING"]  //用于展示列表中的按钮
};

router.get('/allOrders', function(req, res, next) {
    var data = {success:true};
    data.nextPageIndex = 2;
    data.orderList = [Order,Order,Order,Order,Order,Order];
    res.send(data);
});

router.get('/waitPay', function(req, res, next) {
    var data = {success:true};
    data.orderList = [Order,Order];
    res.send(data);
});

router.get('/waitUse', function(req, res, next) {
    var data = {success:true};
    data.orderList = [Order,Order];
    res.send(data);
});

router.get('/loadOneOrder', function(req, res, next) {
    var data = {success:true};
    data.order = Order;
    res.send(data);
});

module.exports = router;
