/**
 * Created by liuyaoa on 2017/11/6.
 */
var express = require('express');
var router = express.Router();

var AdInfo = {
    'image' : 'https://image.urwork.cn/df4649a7-7fc4-4009-a877-a219ee375fc5.jpg',
    'url': 'www.baidu.com'
};
/* GET users listing. */
router.get('/adlist', function(req, res, next) {
    var data = {success:true};
    data.list=[AdInfo,AdInfo];
    res.send(data);
});

module.exports = router;