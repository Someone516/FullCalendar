var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var skiSchoolSchema = require('../MongoModels/skiSchools.js');

/*GET all skiSchools*/
router.get('/', function(req, res){
	skiSchoolSchema.find(function(err, data){
		if(err){
			console.log('error getting calendars: '+err);
			console.log(err);
			res.send(err);
			return;
		}
		res.json(data);
	});
});


/*POST a new skiSchool*/
router.post('/', function(req,res){
	if(req.body.name){
		var skiSchool = {name: req.body.name};
		var item = new skiSchoolSchema(skiSchool);
		item.save(function(err, status){
		if (err){
			console.log('error saving new skiSchool to DB!');
			console.log(err);
			res.send(err);
			return;
		}
		console.log("added a new skiSchool to DB");
		res.json({"added-a-new-skiSchol": req.body.name});
		});
	}
	else
		res.json({"error": "name not supplied!"});
	
});


module.exports = router;