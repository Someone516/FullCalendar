var mongoose = require('mongoose');

var instructorSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  calendars: [{
  	type: mongoose.Schema.ObjectId,
  	ref: 'calendars'
  }]
});

module.exports = mongoose.model('instructors', instructorSchema);


/*var instructorSchema = new mongoose.Schema({
	instructorID: {type: String, required: true},
	firstName: {type: String, required: true},
	middleName: {type: String, required: true},
	lastName: {type: String, required: true},
	socialMediaString1: type: String,
	socialMediaString2: type: String,
	socialMediaString3: type: String,
	isAdmin: {type: Boolean, required: true},
	associatedWith: {
		type: mongoose.Schema.ObjectId,
		ref: 'skiSchool',
		required: true
	},
	events: [{
		studentUserID: {
			type: mongoose.Schema.ObjectId,
			ref: 'simpleUser',
			required: true		
		},
		title: {type: String, required: true},
		start: {type: Date, required: true},
		end: {type: Date, required: true},
		allDay: {type: Boolean, required: true},
	}],
	reviews: [{
		userName: {type: String, required: true},
		title: {type: String, required: true},
		review: {type: String, required: true},
		reviewDate: {type: Date, required: true},
		reviewUnit1: {type: Number, min: 1, max: 5}
		reviewUnit2: {type: Number, min: 1, max: 5}
		reviewUnit3: {type: Number, min: 1, max: 5}
	}]
});*/