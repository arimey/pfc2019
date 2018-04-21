
var mongoose = require('mongoose');

var subjectSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	space: Number,
	state: String
});

module.exports = mongoose.model('Subject', subjectSchema);