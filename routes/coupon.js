var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/loadUserCoupon', function(req, res, next) {
	var array = [
        {
            'id': 1234,
            'basicPrice' : 30,
            'limit': 200,
            'couponName' : '满200减20',
            'timeStart' : 1508566101200,
            'timeEnd' : 1508566101200
        },{
            'id': 12345,
            'basicPrice' : 20,
            'limit': 0,
            'couponName' : '满200减20',
            'timeStart' : 1508566101200,
            'timeEnd' : 1508566101200
        }
    ];
    var data = {success:true};

    data.couponList = array;
    res.send(data);
   //res.render('index', { title: 'Express',array:array });
});

module.exports = router;
