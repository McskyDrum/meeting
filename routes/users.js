var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userInfo', function(req, res, next) {
    var data = {
        success:true,
        userInfo:{
            userImg:"/image/d-logo.jpg",
		    name:"用户昵称"
        },
        orderInfo:{ //订单信息
            waitPayOrderCount:2,//  Integer  待支付订单总数
            canOpenOrderCount:0 // Integer   待使用订单总数
        }
    };
    res.send(data);
});

module.exports = router;
