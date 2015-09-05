var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var instructorSchema = require('../MongoModels/instructors.js');
var instructorSchema = require('../MongoModels/newInstructors.js');

/*GET all instructors*/
/*router.get('/', function(req, res){
	instructorSchema.find(function(err, data){
		if(err){
			console.log('error getting instructors: '+err)
			return err;
		}
		res.json(data);
	});
});*/

/*POST a new instructor document*/
/*router.post('/', function(req, res){
	res.json({"post": req.body});
});
*/
/*PUT (edit) a single instructor document*/
/*router.put('/:Iid', function(req, res){
	var Iid = req.params.Iid;
	res.json({"put": Iid});
});
*/
/*DELETE a single instructor document*/
/*router.delete('/:Iid', function(req, res){
	var Iid = req.params.Iid;
	res.json({"delete": Iid});
});
*/


/*GET all instructors*/
router.get('/', function(req, res){
	instructorSchema.find(function(err, data){
		if(err){
			console.log('error getting instructors: '+err)
			return err;
		}
		res.json(data);
	});
});

/*GET all instructor names - used to build the checkboxes*/
router.get('/all/instructorNames', function(req, res){
	instructorSchema.find(
		{},
		{"firstName":1},
		function(err, data){
			if(err){
				console.log('error getting instructors: '+err)
				return err;
			}
			res.json(data);
		}
	);
});

/*GET a single instructor with events OR GET few instructors with events*/
router.get('/:Iid', function(req, res){
	var array = req.params.Iid.split(",");
	//for getting a single calendar
	if(array.length==1){
		instructorSchema.findOne({"_id": array[0]}, function(err, data){
			if(err){
				console.log('error GETting a single instructor');
				console.log(err);
				res.send(err);
				return;
			}
			res.json(data);
		});
	}
	//for getting multiple (not all) instructors
	else{
		instructorSchema.find(
			{"_id": {$in: array}},
			function(err, data){
				if(err){
					console.log('error GETting multiple instructors');
					console.log(err);
					res.send(err);
					return;
				}
				res.json(data);
			}
		);
	}
});

/*POST a new instructor*/
router.post('/',function(req,res){
	var instructor = {
		instructorID: req.body.instructorID,
		firstName: req.body.firstName,
		middleName: req.body.middleName,
		lastName: req.body.lastName,
		associatedWith: req.body.associatedWith,
		events: [],
		reviews: []
	};

	if(req.body.isAdmin === "true"){
		instructor.isAdmin = true;
	}
	else{
		instructor.isAdmin = false;
	}

	var item = new instructorSchema(instructor);
	item.save(function(err, status){
		if (err){
			console.log('error saving new instructor to DB!');
			console.log(err);
			res.send(err);
			return;
		}
		console.log("added a new instructor to DB");
		res.json({"added-a-new-instructor": req.body.firstName});
	});
});

/*DELETE an instructor document*/
router.delete('/:Iid',function(req,res){
	instructorSchema.remove({"_id": req.params.Iid}, function(err,data){
		if (err){
			console.log('error deleting an instructor!');
			console.log(err);
			res.send(err);
			return;
		}
		res.json({"removed": req.params.Iid});
	});
});



module.exports = router;
