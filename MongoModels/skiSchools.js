var mongoose = require('mongoose');

var skiSchoolSchema = new mongoose.Schema({
	name: String
});

module.exports = mongoose.model('skiSchools', skiSchoolSchema);