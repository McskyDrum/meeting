var express = require('express');
var router = express.Router();

var Coupon = {
    'id': 1234,
    'basicPrice' : 0,
    'couponPrice': 20000,
    'couponName' : '满200减20',
    'timeStart' : 1508566101200,
    'timeEnd' : 1508566101200,
    'getTime':1508566101200
};

/* GET home page. */
router.get('/loadUserCoupon', function(req, res, next) {
	var array = [Coupon,{
        'id': 12345,
        'basicPrice' : 20000,
        'couponPrice' : 2000,
        'couponName' : '满200减20',
        'timeStart' : 1508566101200,
        'timeEnd' : 1508566101200,
        'getTime':1508566101200
    }
    ];
    var data = {success:true};

    data.couponList = array;
    res.send(data);
   //res.render('index', { title: 'Express',array:array });
});

module.exports = router;
