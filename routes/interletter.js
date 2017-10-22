var express = require('express');
var router = express.Router();

router.get('/get', function(req, res, next) {
	var id = req.query.id;  		
  	var model = {
  		success:true,
  		letter:{
  			id:id,
  			title:"我还是蛮屌的",
  			sender:"兑吧团队",
  			time:1469354374044,
  			content:"<p>我爱你</p>"
  		}
  	}
  res.send(model);
});