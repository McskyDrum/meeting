var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var array = ["wo","ni"]

  res.render('index', { title: 'Express',array:array });
});

module.exports = router;
