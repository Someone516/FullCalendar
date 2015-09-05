var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  start: Date,
  end: Date,
  allDay: Boolean
});

var calendarSchema = new mongoose.Schema({
  calendarName: {type: String, required: true},
  description: String,
  events: [eventSchema]  
  /*createdBy: {
  	type: mongoose.Schema.ObjectId,
  	ref: 'instructors'
  },
  sharedWith: [{
  	type: mongoose.Schema.ObjectId,
  	ref: 'instructors'
  }]*/
});

module.exports = mongoose.model('calendars', calendarSchema);