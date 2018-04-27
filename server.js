
var express = require('express');
var app = express();
var util = require('util');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var mediasoup = require("mediasoup");
var fs = require('fs');
var session = require('express-session');
var configDB = require('./config/database.js');
var salas = [];
var app_port = process.env.PORT || 3000;
var app_host = process.env.HOST || '127.0.0.1';
var optSSL = {
	key : fs.readFileSync('./keys/campus.key'),
	cert : fs.readFileSync('./keys/campus.crt')
}

var server = require('https').createServer(optSSL, app);
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
var idRoomSocket = new Map();
var socketPeer = new Map();
var presentationUrls = new Map();


io.on('connection', function(client) {

	console.log('Client ' + client.id + ' connected to socket.');
	client.on('startMediasoup', function(roomId) {
		console.log(roomId);
		if (!mediasoupRoomsMap.has(roomId)) {
			try {
				var room = new mediasoupRooms(roomId, mediasoup, io);
				idRoomSocket.set(client.id, roomId);
				mediasoupRoomsMap.set(roomId, room);
				client.join(roomId);
				console.log('Creating room mediasoup server');
			}
			catch (error) {
				console.log(error);
			}
		}
		else {
			if (!idRoomSocket.has(client.id)) {
				client.join(roomId);
				idRoomSocket.set(client.id, roomId);
			}
			//room = mediasoupRoomsMap.get(roomId);
		}
		if (presentationUrls.has(roomId)) {
			let presentationUrl = presentationUrls.get(roomId);
			io.sockets.in(roomId).emit('newPresentation', presentationUrl);
		}
	});

	client.on("mediasoupRoomRequest", (request,fn) => {
		console.log("Id del client : " + idRoomSocket.get(client.id));
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		switch(request.body.target) {
			case "peer" : {
				console.log(request.body.method);
				roomLocal.manageMediasoupPeerRequest(request, fn);
				break;
			}
			case "room" : {
				if (request.body.method == "join") {
					socketPeer.set(client.id, request.body.peerName);
				}
				roomLocal.manageMediasoupRoomRequest(request.body, fn);
				break;
			}
		}
	});

	client.on("mediasoupRoomNotification", (notification) => {
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		console.log("NOTIFICATION " + notification.body.method);
		switch(notification.body.target) {
			case "peer" : {
				roomLocal.manageMediasoupPeerNotification(notification);
				break;
			}
		}
	});

	client.on("peerLeaving", (peerName) => {
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		console.log("Cerrando peer 1");
		roomLocal.closePeer(peerName);
	});

	client.on("disconnect", () => {
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		var nombre = socketPeer.get(client.id);
		if (typeof nombre !== "undefined") {
			console.log("Se ha desconectado: " + nombre);
			//room.closePeer(nombre);

		}

	});

	client.on("sendingPresentation", (data) => {
		console.log("Me han enviado presentación desde " + data.key);
		presentationUrls.set(data.key, data.val);
		io.emit('newPresentation', data.val);
		//io.sockets.in(data.key).emit('newPresentation', data.value);
	});


});






require('./app/routes.js')(app, passport);

server.listen(app_port);
console.log('Server running on http://%s:%s', app_host, app_port);

pubIp.v4().then(ip => {
	console.log("pub ip:" + ip);
});

console.log("priv ip:" + privIp.getLocalIP4());
