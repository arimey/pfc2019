import * as mediasoupClient from 'mediasoup-client';
//import React from 'react';
//import ReactDOM from 'react-dom';

class mediasoup {
  constructor(socket, idRoom) {
    this.transportSocket = socket;
    this.transportSocket.emit("startMediasoup", idRoom);
    this.stream = new MediaStream();
    this.consumers = new Map();
    this.peers = new Map();
    this.room = new mediasoupClient.Room(
      {
        requestTimeout : 12000
      });

    this.room.on("request", (request, callback, errback) => {
      this.transportSocket.emit("mediasoupRoomRequest", { peer: this.name, body: request }, (response) => {
        callback(response);
      });
    });

    this.room.on("notify", (notification) => {
      this.transportSocket.emit("mediasoupRoomNotification", { peer: this.name, body: notification });
    });

    this.room.on("newpeer", (peer) => {
      this.handlePeer(peer);
    });

    this.transportSocket.on("peerNotification", (notification) => {
      this.room.receiveNotification(notification);

    });

    this.room.on("close", () => {
      this.transportSocket.emit("peerLeaving", this.name);
    });

  }

  join() {
    this.name = $("#userName").val();
    this.room.join(this.name)
      .then((peers) => {
        this.recvTransport = this.room.createTransport('recv');
        this.sendTransport = this.room.createTransport('send');
        this.sendTransport.on("stats", (stats) => {
          console.log(stats);
        });
        this.sendTransport.on("connectionstatechange", (connectionstate) => {
          console.log("Estado Ice" + connectionstate);
          if (connectionstate == "connected") {
            this.audioProducer.resume();
          }
        });
        for (var peer of peers) {
          console.log(peer.name);
          this.handlePeer(peer);
        }
      })
      .then(() => {
        return navigator.mediaDevices.getUserMedia(
          {
            audio : true
          });
      })
      .then((stream) => {
        var audioTrack = stream.getAudioTracks()[0];
        this.audioProducer = this.room.createProducer(audioTrack, true);

        this.audioProducer.send(this.sendTransport)
          .then(() => console.log("sending our audio"))
          .catch((e) => console.log(e));
      });
  }

  quit() {
    this.room.leave();
    for (var consumer of this.room.consumers) {
      consumer.close();
    }
    for (var producer of this.room.producers) {
      producer.close();
    }
    for (var transport of this.room.transports) {
      transport.close();
    }
  }

  handlePeer(peer) {
    peer.on("newconsumer", (consumer) => {
      console.log("Tengo un nuevo consumer: " + consumer.peer.name);
      this.handleConsumer(consumer);
    });

    for (var consumer of peer.consumers) {
      console.log("Consumer name: " + peer.name);
      this.handleConsumer(consumer);

    }

    peer.on("close", () => {
      console.log("Peer closed");
    });

  }

  handleConsumer(consumer) {
    var audio = document.querySelector('#mediasoupAudio');
    console.log("en handle consumer de : " + consumer.peer.name);
    consumer.resume();

    consumer.receive(this.recvTransport)
      .then((track) => {
        console.log(track);
        this.stream.addTrack(track);
        audio.srcObject = this.stream;
        audio.play();
      });

    consumer.on("close", () => {
      console.log("Consumer closed")
    });
  }

}

module.exports = mediasoup;
