/*INCOMPLETE FILE! */
//This file will deal with getting information about
//instructors who are free in a given time slot

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var instructorSchema = require('../MongoModels/instructors.js');
var calendarSchema = require('../MongoModels/calendars.js');

/*GET all instructors who are 'free' in the given time slot*/
router.get('/:date/:timeSlot', function(req, res){
	instructorSchema.find(
		{
			
		},
		function(err, data){
		if(err){
			console.log('error getting instructors: '+err)
			return err;
		}
		res.json(data);
	});
});
