var express = require('express');
var router = express.Router();

var list = [
	{id:1,name:"54主会场",uv:109,pv:3223},
	{id:2,name:"54主会场",uv:109,pv:3223},
	{id:3,name:"54主会场",uv:109,pv:3223},
	{id:4,name:"54主会场",uv:109,pv:3223},
	{id:5,name:"54主会场",uv:109,pv:3223},
	{id:6,name:"54主会场",uv:109,pv:3223},
	{id:7,name:"54主会场",uv:109,pv:3223},
	{id:8,name:"54主会场",uv:109,pv:3223},
	{id:9,name:"54主会场",uv:109,pv:3223},
	{id:10,name:"54主会场",uv:109,pv:3223},
	{id:11,name:"54主会场",uv:109,pv:3223},
	{id:12,name:"54主会场",uv:109,pv:3223},
	{id:13,name:"54主会场",uv:109,pv:3223},
	{id:14,name:"54主会场",uv:109,pv:3223},
	{id:15,name:"54主会场",uv:109,pv:3223},
	{id:16,name:"54主会场",uv:109,pv:3223},
	{id:17,name:"54主会场",uv:109,pv:3223},
	{id:18,name:"54主会场",uv:109,pv:3223},
	{id:19,name:"54主会场",uv:109,pv:3223},
	{id:120,name:"54主会场",uv:109,pv:3223},
	{id:121,name:"54主会场",uv:109,pv:3223},
	{id:122,name:"54主会场",uv:109,pv:3223},
	{id:123,name:"54主会场",uv:109,pv:3223},
	{id:124,name:"54主会场",uv:109,pv:3223},
	{id:125,name:"54主会场",uv:109,pv:3223},
	{id:126,name:"54主会场",uv:109,pv:3223},
	{id:127,name:"54主会场",uv:109,pv:3223}
]

/* GET users listing. */
router.get('/loadPage', function(req, res, next) {
	var offset = req.query.offset;
	var max = req.query.max;

  	var total = list.length;
  	console.log(offset + max);
  	var newlist  = list.slice(offset,new Number(offset) + new Number(max));
  		

  	var model = {
  		success:true,
  		total:total,
  		list:newlist
  	}
  res.send(model);
});

router.get('/loadType', function(req, res, next) {
  	var model = {
  		success:true,
  		list:[
			{type:"screat",name:"刮刮卡"},
			{type:"dati",name:"答题"}
		]
  	}
  res.send(model);
});

router.post('/delMainMeet', function(req, res, next) {
  	var model = {
  		success:true,
  	}
  res.send(model);
});
module.exports = router;