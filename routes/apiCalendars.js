/*DO NOT USE THIS FILE*/
/*FILE WILL BE DELETED SOON*/
/*THIS FILE IS NOT CONSISTENT WITH THE NEW DB SCHEMA*/
//this file was used for the old DB schema
//which has been changed now.

/*var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var calendarSchema = require('../MongoModels/calendars.js');*/

/*GET all calendars (with events)*/
/*router.get('/', function(req, res){
	calendarSchema.find(function(err, data){
		if(err){
			console.log('error getting calendars: '+err);
			console.log(err);
			res.send(err);
			return;
		}
		res.json(data);
	});
});*/


/*GET a single calendar with events OR GET few calendars with events*/
/*router.get('/:Cid', function(req, res){
	var array = req.params.Cid.split(",");
	//for getting a single calendar
	if(array.length==1){
		calendarSchema.findOne({"_id": array[0]}, function(err, data){
			if(err){
				console.log('error GETting a single calendar');
				console.log(err);
				res.send(err);
				return;
			}
			res.json(data);
		});
	}
	//for getting multiple (not all) calendars
	else{
		calendarSchema.find(
			{"_id": {$in: array}},
			function(err, data){
				if(err){
					console.log('error GETting multiple calendars');
					console.log(err);
					res.send(err);
					return;
				}
				res.json(data);
			}
		);
	}
});*/

/*GET all calendarNames - used to build the checkboxes*/
/*router.get('/all/CalendarNames', function(req, res){
	calendarSchema.find(
		{},
		{"calendarName":1},   //project only "calendarName" and "_id" field
		function(err, data){
			if (err){
				console.log('error getting calendarNames');
				console.log(err);
				res.send(err);
				return;
			}
			res.json(data);
		}
	);
});*/


/*POST a new calendar document*/
/*router.post('/', function(req, res){
	var cal = {
		calendarName: req.body.calendarName,
  		description: req.body.description,
  		events: []  
	};
	var item = new calendarSchema(cal);
	item.save(function(err, status){
		if (err){
			console.log('error saving new calendar to DB!');
			console.log(err);
			res.send(err);
			return;
		}
		console.log("added a new calendar to DB");
		res.json({"added-new-calendar": cal.calendarName});
	});
});*/


/*POST (add) new event to a single calendar*/
/*router.post('/:Cid', function(req, res){
	var newEvent = {
		title: req.body.title
	};
	if(req.body.start)
		newEvent.start = new Date(req.body.start);
	if(req.body.end)
		newEvent.end = new Date(req.body.end);
	newEvent.allDay = true;

	calendarSchema.findByIdAndUpdate(
		req.params.Cid,
		{$push: {"events": newEvent}},
		{},
		function(err, data){
			if (err){
				console.log('error inserting event to calendar');
				console.log(err);
				res.send(err);
				return;
			}
			res.json({"added-event-to": req.params.Cid});
		}
	);
});*/


/*DELETE an event from a calendar*/
/*router.delete('/:Cid/:Eid', function(req, res){
	calendarSchema.findByIdAndUpdate(
		req.params.Cid,
		{$pull: {"events": {"_id": req.params.Eid}}},
		{},
		function(err, data){
			if(err){
				console.log('error deleting an event');
				console.log(err);
				res.send(err);
				return;
			}
			res.json({"removed-event": req.params.Eid});
		}
	);
});*/


/*PUT (edit) an event from a particular calendar*/
//this route is used for eventResize()
/*router.put('/:Cid/:Eid', function(req, res){
	//first find the required calendar
	calendarSchema.findOne({"_id": req.params.Cid}, function(err, data){
		if(err){
			console.log('error in stage 1 of PUTting an event in the calendar');
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
        		calendarSchema.update(
        			{"events._id": req.params.Eid},
        			{$set: {
        				'events.$.end': newDate
        			}},
        			function(err, result){
        				if(err){
							console.log('error modifying event');
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
});*/


/*PUT (edit) an event from a particular calendar*/
//NO NEED of calID, we can directly search based on EventID
//this route is used for eventDrop()
/*router.put('/:Eid', function(req, res){

	//query the database
	calendarSchema.update(
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
});*/

/*DELETE a single calendar document*/
/*router.delete('/:Cid', function(req, res){
	var Cid = req.params.Cid;
	calendarSchema.remove({"_id": Cid}, function(err, data){
		if (err){
			console.log('error deleting a calendar!');
			console.log(err);
			res.send(err);
			return;
		}
		res.json({"removed": Cid});
	});
});

module.exports = router;*/