
var express = require('express');
var app = express();
var util = require('util');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var mediasoup = require("mediasoup");

var salas = [];

var session = require('express-session');

var configDB = require('./config/database.js');

var app_port = process.env.PORT || 3000;
var app_host = process.env.HOST || '127.0.0.1';

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('./config/passport.js')(passport);

mongoose.connect(configDB.url, { useMongoClient: true });
mongoose.Promise = require('bluebird');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log('CONECTADOS A LA BASE DE DATOS');
})

app.engine('html', require('ejs').renderFile);

app.use(bodyParser());

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/src', express.static(__dirname + '/src'));


var mediasoupRooms = require("./app/mediasoupTransport.js");
var mediasoupRoomsMap = new Map();

io.on('connection', function(client) {
	console.log('Client ' + client.id + ' connected to socket.');
	var room;
	client.on('startMediasoup', function(roomId) {
		if (!mediasoupRoomsMap.has(roomId)) {
			try {
				room = new mediasoupRooms(roomId, mediasoup, io);
				mediasoupRoomsMap.set(roomId, room);
			}
			catch (error) {

			}
		}
		else {
			room = mediasoupRoomsMap.get(roomId);
		}
	});
});






require('./app/routes.js')(app, passport);

server.listen(app_host);
console.log('Server running on http://%s:%s', app_host, app_port);


/*http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World from Cloudnode\n\n');
    res.end();
}).listen(app_port);
console.log('Web server running at http://' + app_host + ':' + app_port);*/
