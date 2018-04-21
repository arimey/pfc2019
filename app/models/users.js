

var mongoose = require('mongoose');
var Subject = require('./subjects.js');

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	username: {
		type: String,
		unique: true
	},
	password: String,
	passwordConf: String,
	userType: Number,
	subjects: [{ type: mongoose.Schema.ObjectId, ref: "Subject" }]
});

module.exports = mongoose.model('User', userSchema);