import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import ConnectionBox from './components/ConnectionBox.jsx';

var mediasoupApp = require("./mediasoupFirstApp.js");
var mediasoupObj;

$(document).ready(() => {
	var socket = io();
	mediasoupObj = new mediasoupApp(socket, $('#room').val());
	ReactDOM.render(<ConnectionBox con={socket}/>, document.getElementById('usersBox'));
	mediasoupObj.join();
	$('#formExit').submit(() => {
		mediasoupObj.quit()
			.then((condition) => {
					console.log("nos vamos");
					return condition;
			});
	});
	window.onbeforeunload = () => {
		mediasoupObj.quit();
	}
});
