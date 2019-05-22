
var mongoose = require('mongoose');

var subjectSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	space: Number,
	connections: {type: Number, default: 0},
	state: String
});

module.exports = mongoose.model('Subject', subjectSchema);
