var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	studentUserID: {type: String, required: true},
	title: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	allDay: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
	userName: {type: String, required: true},
	title: {type: String, required: true},
	review: {type: String, required: true},
	reviewDate: {type: Date, required: true},
	reviewUnit1: {type: Number, min: 1, max: 5},
	reviewUnit2: {type: Number, min: 1, max: 5},
	reviewUnit3: {type: Number, min: 1, max: 5}
});

var instructorSchema = new mongoose.Schema({
	instructorID: {type: String, required: true},
	firstName: {type: String, required: true},
	middleName: {type: String, required: true},
	lastName: {type: String, required: true},
	socialMediaString1: String,
	socialMediaString2: String,
	socialMediaString3: String,
	isAdmin: {type: Boolean, required: true},
	associatedWith: {
		type: mongoose.Schema.ObjectId,
		ref: 'skiSchools',
		required: true
	},
	events: [eventSchema],
	reviews: [reviewSchema]
});

module.exports = mongoose.model('instructors', instructorSchema);