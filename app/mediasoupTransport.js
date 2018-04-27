'use strict';

var EventEmitter = require('events').EventEmitter;
var config = require('./../config/mediaCodecs.js');
var serverOptions = require('./../config/mediasoupOptions.js');

class mediasoupTransport extends EventEmitter {
  constructor(id, mediasoupServer, socketTransport) {
    super();

    this._roomId = id;
    this._ioTransport = socketTransport;
    this._peers = new Map();

    try {
      this._server = mediasoupServer.Server(serverOptions);
      this._mediaRoom = this._server.Room(config);
    }
    catch (error) {
      this.close();
      throw error;
    }


    this._mediaRoom.on("newpeer", (peer) => {
      console.log("nuevo peer creado: %s", peer.name);
      this._peers.set(peer.name, peer);
      var keys = Array.from(this._peers.keys());
      this._ioTransport.sockets.in(this._roomId).emit("newUserConBox", keys);

      peer.on("notify", (notification) => {
        this._ioTransport.sockets.in(this._roomId).emit("peerNotification", notification);
      });

      peer.on("close", (originator) => {
        console.log("Peer cerrado por " + originator);
        this.closePeer(peer.name);
      });
    });


  }

  close() {

  }

  closePeer(name) {
    console.log("eliminando peer: " + name);
    var peer = this._peers.get(name);
    this._peers.delete(name);
    var keys = Array.from(this._peers.keys());
    this._ioTransport.sockets.in(this._roomId).emit("newUserConBox", keys);
    if (this._mediaRoom.getPeerByName(name)) {
      this._mediaRoom.getPeerByName(name).close();
    }
  }

  manageMediasoupRoomRequest(request, callback) {
    switch (request.method) {
			case "queryRoom" : {
        this._mediaRoom.receiveRequest(request)
          .then((response) => {
            //console.log(response);
            callback(response);
          })
          .catch((error) => console.log(error.toString()));
				break;
			}

			case "join" : {
				const { peerName } = request;
				this._mediaRoom.receiveRequest(request)
					.then((response) => {
						var peer = this._mediaRoom.getPeerByName(peerName);
            peer.on("newconsumer", (consumer) => {
              console.log("un nuevo consumer creado en el servidor: ", consumer.peer.name)
              consumer.resume();
            })

						console.log("New peer joined: %o", peer.name);
            callback(response);
					})
					.catch((error) => console.log(error.toString()));
				break;
			}
		}
  }

/*  manageMediasoupRoomNotification(notification) {

  }
*/
  manageMediasoupPeerNotification(notification) {
    //console.log("Notificacion" + notification.body.method);
    this._mediaRoom.getPeerByName(notification.peer).receiveNotification(notification.body);
    switch(notification.body.method) {
      case "updateTransport": {
        break;
      }
      case "closeTransport" : {
        console.log("Closing Transport");
        break;
      }
      case "enableTransportStats" : {
        break;
      }
      case "updateProducer" : {
        break;
      }
      case "resumeProducer" : {
        break;
      }
      case "closeProducer" : {

      }

    }
  }

  manageMediasoupPeerRequest(request, callback) {
    switch (request.body.method) {
      case "createTransport" : {
        console.log("Creando transport servidor");
        console.log("Id del peer: %s", request.peer);
        this._mediaRoom.getPeerByName(request.peer).receiveRequest(request.body)
          .then((response) => {
            console.log(response);
            callback(response);
          });
        /*this._mediaRoom.getPeerByName(request.id).receiveRequest(request)
          .then((response) => {
            console.log(response);
            callback(response);
          });*/
        break;
      }

      case "enableConsumer" : {
        this._mediaRoom.getPeerByName(request.peer).receiveRequest(request.body)
          .then((response) => {
            console.log("Activamos la recepción de audio: " + request.peer);
            this._mediaRoom.createActiveSpeakerDetector();
            callback(response);
          });
          break;
      }

      case "restartTransport" : {
        //console.log("Reseteando transport");
        this._mediaRoom.getPeerByName(request.peer).receiveRequest(request.body)
          .then((response) => {
            console.log(response);
            callback(response);
          });
        break;
      }

      case "closeTransport" : {
        //console.log("Cerrando Transport");
        break;
      }

      case "createProducer" : {
        console.log("Creando producer");
        this._mediaRoom.getPeerByName(request.peer).receiveRequest(request.body)
          .then(() => {
            console.log("Producer creado por: " + request.peer);
          });
        break;
      }

      case "closeProducer" : {
        //console.log("Cerrando producer");
        break;
      }
    }
  }


}

module.exports = mediasoupTransport;
