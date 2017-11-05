var express = require('express');
var router = express.Router();

var User = {
    'name' : 'test1',
    'company': 'company1',
    'email' : 'test@test.com'
};
/* GET users listing. */
router.get('/getUserInfo', function(req, res, next) {
    var data = {success:true};
    data.user = User;
    res.send(data);
});

module.exports = router;
