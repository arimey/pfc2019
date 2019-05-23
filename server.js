var express = require('express');
var app = express();
var util = require('util');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var mediasoupOptions = require("./config/mediasoupOptions");
var mediasoup = require("mediasoup").Server(mediasoupOptions);
var fs = require('fs');
var session = require('express-session');
var configDB = require('./config/database.js');
var salas = [];
var app_port = process.env.PORT || 8080;
var app_host = process.env.HOST || '127.0.0.1';
var optSSL = {
	key : fs.readFileSync('./keys/campus.key'),
	cert : fs.readFileSync('./keys/campus.crt')
}

var SubjectRooms = require('./app/models/subjects.js');
var UserRooms = require('./app/models/users.js');

var server = require('https').createServer(optSSL, app);
//var server = require('http').Server(app);

var pubIp = require('public-ip');
var privIp = require('quick-local-ip');

require('./config/passport.js')(passport);

var io = require('socket.io')(server);

mongoose.connect(configDB.url, { useMongoClient: true });
mongoose.Promise = require('bluebird');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log('connected at database');
})

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
									saveUninitialized: true,
									resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/src', express.static(__dirname + '/src'));

var dbController = require('./app/DatabaseController.js');
var dbControllerOb;
var dbControllerRoom;


var mediasoupRooms = require("./app/mediasoupTransport.js");
var mediasoupRoomsMap = new Map();
var idRoomSocket = new Map();
var socketPeer = new Map();
var peerSocket = new Map();
var presentationUrls = new Map();
var roomPdf = new Map();
var connectionCountsRoom = new Map();

var roomSpace = io.of('/roomSpace');

roomSpace.on('connection', function(socket) {

	socket.on('findAllSubjectsForUser', function(userName, callback) {
		UserRooms.find({ username: userName }, (err, user) => {
				if (err) throw err;
				SubjectRooms.populate(user, {path: "subjects"}, (err, userS) => {
					userS[0].subjects.map((item, index) => {
						if (connectionCountsRoom.has(item.name) && connectionCountsRoom.get(item.name) > 0) {
							userS[0].subjects[index].connections = connectionCountsRoom.get(item.name);
						} else {
							userS[0].subjects[index].connections = 0;
							resetPdfRoom(item.name);
						}
						console.log(userS[0].subjects[index]);
					});
					callback(userS[0].subjects);
				})
		});
	})
});

io.on('connection', function(client) {
	console.log('Client ' + client.id + ' connected to socket.');
	client.emit("connected", "Conexión realizada");
	client.on('adminConecting', () => {
		dbControllerOb = new dbController(io, client, client.id);
	});

	client.on('startMediasoup', function(roomId) {
		console.log(roomId);
		changeRoomUsersCount(roomId, 1);
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
		}
		if (roomPdf.has(roomId)) {
			let pdf = roomPdf.get(roomId);
			io.sockets.in(roomId).emit('newPdf', pdf);
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
					peerSocket.set(request.body.peerName, client.id);
					roomLocal.updateSocketClients(socketPeer);
					roomLocal.manageMediasoupRoomRequest(request.body, fn);
				}
				else {
					roomLocal.manageMediasoupRoomRequest(request.body, fn);
				}

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
		roomLocal.closePeer(peerName);
	});



	client.on("sendingPresentation", (data) => {
		presentationUrls.set(data.key, data.val);
		io.sockets.in(data.key).emit('newPresentation', data.val);
	});
socketPeer
	client.on("newUserState", (data) => {
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		let roomId = idRoomSocket.get(client.id);
		let statesMap = roomLocal.changePeerState(data.name, data.state, socketPeer);
		io.sockets.in(roomId).emit("newUserState", statesMap);
	});

	client.on("chat message", (data) => {
		console.log(data.user);
		io.sockets.in(data.room).emit("new message", {msg: data.msg, name: data.user});
	});

	client.on("openAllPeers", (data) => {
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		roomLocal.openAllProducers(data, peerSocket);
	});

	client.on("closeAllPeers", (data) => {
		let roomLocal = mediasoupRoomsMap.get(idRoomSocket.get(client.id));
		roomLocal.closeAllProducers(data, peerSocket);
	});

	client.on("newPdf", (data) => {
		let roomId = idRoomSocket.get(client.id);
		roomPdf.set(roomId, data);
		io.sockets.in(roomId).emit("newPdf", data);
	});

	client.on("currentPage", (numPage) => {
		let roomId = idRoomSocket.get(client.id);
		let pdf = roomPdf.get(roomId);
		roomPdf.set(roomId, {data: pdf.data, num: numPage});
		io.sockets.in(roomId).emit("updatePage", numPage);
	});

	client.on("disconnect", () => {
		let peer = socketPeer.get(client.id);
		let roomName = idRoomSocket.get(client.id);

		if (roomName) {
			changeRoomUsersCount(roomName, -1);
		}
		socketPeer.delete(client.id);
		peerSocket.delete(peer);
		idRoomSocket.delete(client.id);

	});
});

function changeRoomUsersCount(roomId, count)
{
	if (!connectionCountsRoom.has(roomId)) {
		connectionCountsRoom.set(roomId, 1);
	} else {
		var actualConnectionsRoom = connectionCountsRoom.get(roomId) + (count);
		connectionCountsRoom.set(roomId, actualConnectionsRoom);
	}
}

function resetPdfRoom(roomId)
{
	roomPdf.delete(roomId);
}

require('./app/routes.js')(app, passport);

const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });

pubIp.v4().then(ip => {
	console.log("pub ip:" + ip);
});

console.log("priv ip:" + privIp.getLocalIP4());
