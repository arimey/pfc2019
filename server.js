
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
var io = require('socket.io')(server);

var pubIp = require('public-ip');
var privIp = require('quick-local-ip');

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
var room;

io.on('connection', function(client) {
	var socketPeer = new Map();
	console.log('Client ' + client.id + ' connected to socket.');
	client.on('startMediasoup', function(roomId) {
		console.log('Creating room mediasoup server');
		if (!mediasoupRoomsMap.has(roomId)) {
			try {
				console.log("no hay room");
				room = new mediasoupRooms(roomId, mediasoup, io);
				mediasoupRoomsMap.set(roomId, room);
			}
			catch (error) {
				console.log(error);
			}
		}
		else {
			room = mediasoupRoomsMap.get(roomId);
		}
	});

	client.on("mediasoupRoomRequest", (request,fn) => {
		switch(request.body.target) {
			case "peer" : {
				console.log(request.body.method);
				room.manageMediasoupPeerRequest(request, fn);
				break;
			}
			case "room" : {
				if (request.body.method == "join") {
					socketPeer.set(client.id, request.body.peerName);
				}
				room.manageMediasoupRoomRequest(request.body, fn);
				break;
			}
		}
	});

	client.on("mediasoupRoomNotification", (notification) => {
		console.log("NOTIFICATION " + notification.body.method);
		switch(notification.body.target) {
			case "peer" : {
				room.manageMediasoupPeerNotification(notification);
				break;
			}
		}
	});

	client.on("peerLeaving", (peerName) => {
		console.log("Cerrando peer 1");
		room.closePeer(peerName);
	});

	client.on("disconnect", () => {
		var nombre = socketPeer.get(client.id);
		if (typeof nombre !== "undefined") {
			console.log("Se ha desconectado: " + nombre);
			//room.closePeer(nombre);

		}

	});


});






require('./app/routes.js')(app, passport);

server.listen(app_port);
console.log('Server running on http://%s:%s', app_host, app_port);

pubIp.v4().then(ip => {
	console.log("pub ip:" + ip);
});

console.log("priv ip:" + privIp.getLocalIP4());
