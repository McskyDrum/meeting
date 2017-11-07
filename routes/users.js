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

router.get('/getUserInfo', function(req, res, next) {
    var data = {
        success:true,
        userInfo:{
            name:"用户昵称",
            company:"公司名称",
            email:"123455@qq.com"
        }
    };
    res.send(data);
});

router.post('/saveUserInfo', function(req, res, next) {
    var data = {
        success:true,
    };
    res.send(data);
});




module.exports = router;
