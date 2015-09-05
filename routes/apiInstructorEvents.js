var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var instructorSchema = require('../MongoModels/newInstructors.js');


/*GET all events for a given instructor*/
router.get('/:Iid', function(req,res){
	instructorSchema.findOne(
		{"_id": req.params.Iid},
		{"events":1},
		function(err, data){
			if(err){
				console.log('error getting events for instructor: '+req.params.Iid);
				console.log(err);
				res.send(err);
				return;	
			}
			res.json(data);
		}
	);
});


/*POST (add) new event to a given instructor*/
router.post('/:Iid', function(req, res){
	
	var newEvent = {
		title: req.body.title,
		start: new Date(req.body.start),
		end: new Date(req.body.end),
		allDay: true,
		studentUserID: "placeHolder_000"
	};

	instructorSchema.findByIdAndUpdate(
		req.params.Iid,
		{$push: {"events": newEvent}},
		{},
		function(err, data){
			if (err){
				console.log('error adding event for instructor: '+req.params.Iid);
				console.log(err);
				res.send(err);
				return;
			}
			res.json({"added-event-to": req.params.Iid});
		}
	);
});

/*DELETE an event from an instructor*/
router.delete('/:Iid/:Eid', function(req, res){
	instructorSchema.findByIdAndUpdate(
		req.params.Iid,
		{$pull: {"events": {"_id": req.params.Eid}}},
		{},
		function(err, data){
			if(err){
				console.log('error deleting an event from instructor: '+req.params.Iid);
				console.log(err);
				res.send(err);
				return;
			}
			res.json({"removed-event": req.params.Eid});
		}
	);
});


/*PUT (edit) an event from a particular instructor
This route is used when dragging and dropping events from
one date to another*/
//NO NEED of instructorID, we can directly search based on EventID
//this route is used for eventDrop()
router.put('/:Eid', function(req, res){

	//query the database
	instructorSchema.update(
		{"events._id": req.params.Eid},
		{$set: {
			'events.$.start': req.body.start,
			'events.$.end': req.body.end,
			'events.$.allDay': req.body.allDay
		}},
		function(err, data){
			if(err){
				console.log('error modifying event');
				console.log(err);
				res.send(err);
				return;
			}

			res.json({"modifiedTheEvent": req.params.Eid});
		}
	);
});


/*PUT (edit) an event from a particular calendar
This route should be used when resizing an event*/
//this route is used for eventResize()
/*could have used similar pattern as above PUT route (i.e. no Iid required)
but used this instead to differentiate requests*/
router.put('/:Iid/:Eid', function(req, res){
	//first find the required calendar
	instructorSchema.findOne({"_id": req.params.Iid}, function(err, data){
		if(err){
			console.log('error finding the required instructor! (PUT2 route)');
			console.log(err);
			res.send(err);
			return;
		}

		for(var i=0;i<data.events.length;i++){
			
			//operate only on the matching event
			if(data.events[i]._id == req.params.Eid){
				
				//build the new date from delta
        		var newDate = new Date(data.events[i].end.getTime() + parseInt(req.body.delta));

        		//query the DB again to set new date
        		instructorSchema.update(
        			{"events._id": req.params.Eid},
        			{$set: {
        				'events.$.end': newDate
        			}},
        			function(err, result){
        				if(err){
							console.log('error modifying event! (PUT2 route)');
							console.log(err);
							res.send(err);
							return;
        				}
        				res.json({"modifiedEndOfTheEvent": req.params.Eid});
        			}
        		);
			}
		}
	});
});


module.exports = router;