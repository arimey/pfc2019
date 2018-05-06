'use strict';

var EventEmitter = require('events').EventEmitter;
var config = require('./../config/mediaCodecs.js');

class mediasoupTransport extends EventEmitter {
    constructor(id, mediasoupServer, socketTransport) {
        super();

        this._roomId = id;
        this._ioTransport = socketTransport;
        this._peers = new Map();
        this._activePeers = new Map();
        this._socketPeers = new Map();

        try {
            this._mediaRoom = mediasoupServer.Room(config);
        }
        catch (error) {
            this.close();
            throw error;
        }


    }

    sendActualUsersConected() {
        let users;
        let activesMapToJson;
        users = Array.from(this._peers.keys());
        activesMapToJson  = JSON.stringify([...this._activePeers]);
        this._ioTransport.sockets.in(this._roomId).emit("newUserConBox", {'users': users, 'states': activesMapToJson});
    }

    //Update a peer state for transport the produces and update view
    changePeerState(name, state, socketList) {
        this._activePeers.set(name, state);
        let socketClientId;
        socketList.forEach((value, key) => {
            if (value === name) {
                socketClientId = key;
            }
        })
        if (state) {
            this._ioTransport.sockets.connected[socketClientId].emit("activeProducer");
        }
        else {
            this._ioTransport.sockets.connected[socketClientId].emit("desactiveProducer");
        }
        return JSON.stringify([...this._activePeers]);
    }


    close() {

    }

    //Close peer and update the view
    closePeer(name) {
        console.log("eliminando peer: " + name);
        var peer = this._peers.get(name);
        this._peers.delete(name);
        this._activePeers.delete(name);
        this.sendActualUsersConected();
        if (this._mediaRoom.getPeerByName(name)) {
            this._mediaRoom.getPeerByName(name).close();
        }
    }

    handlePeer(peer) {
        this._peers.set(peer.name, peer);
        this._activePeers.set(peer.name, false);
        this.sendActualUsersConected();

        peer.on("notify", (notification) => {
            if (notification.method == "newConsumer") {
                console.log("NEW CONSUMER OF: " + notification.peerName);
            }
            this._socketPeers.forEach((val, key) => {
                if (val == peer.name) {
                    this._ioTransport.sockets.connected[key].emit("peerNotification", notification);
                }
            });

        });

        peer.on("newtransport", (transport) => {
            console.log("newTransport");
        });

        peer.on("close", (originator) => {
            console.log("Peer cerrado por " + originator);
            this.closePeer(peer.name);
        });

    }

    //Manage mediasoup request to roomserver (queryroom and join)
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
                    this.handlePeer(peer);


                    callback(response);
                })
                .catch((error) => console.log(error.toString()));
                break;
            }
        }
    }

    //Manage mediasoup notifications for peer server
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
                break;
            }
        }
    }

    manageMediasoupPeerRequest(request, callback) {
        switch (request.body.method) {
            case "createTransport" : {
                //console.log("Creando transport servidor");
                //console.log("Id del peer: %s", request.peer);
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
                    //console.log("Activamos la recepción de audio: " + request.peer);
                    this._mediaRoom.createActiveSpeakerDetector();
                    callback(response);
                });
                break;
            }

            case "restartTransport" : {
                //console.log("Reseteando transport");
                this._mediaRoom.getPeerByName(request.peer).receiveRequest(request.body)
                .then((response) => {
                    //console.log(response);
                    callback(response);
                });
                break;
            }


            case "createProducer" : {
                //console.log("Creando producer");
                this._mediaRoom.getPeerByName(request.peer).receiveRequest(request.body)
                .then((response) => {
                    callback(response);
                    console.log("Producer creado por: " + request.peer);
                });
                break;
            }

        }
    }

    openAllProducers(data, peerSocketMap) {
        this._mediaRoom.peers.forEach((item, index) => {
            let socketId = peerSocketMap.get(item.name);
            console.log(socketId);
            this._ioTransport.sockets.connected[socketId].emit("activeProducer");
            this._activePeers.set(item.name, true);
        });
        let states = JSON.stringify([...this._activePeers]);
        this._ioTransport.in(data.room).emit("newUserState", states);
    }

    closeAllProducers(data, peerSocketMap) {
        this._mediaRoom.peers.forEach((item, index) => {
            if (item.name != data.name) {
                let socketId = peerSocketMap.get(item.name);
                this._ioTransport.sockets.connected[socketId].emit("desactiveProducer");
                this._activePeers.set(item.name, false);
            }
        });
        let states = JSON.stringify([...this._activePeers]);
        this._ioTransport.in(data.room).emit("newUserState", states);
    }

    updateSocketClients(socketMap) {
        this._socketPeers = socketMap;
    }


}

module.exports = mediasoupTransport;
