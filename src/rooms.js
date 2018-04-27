import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import ConnectionBox from './components/ConnectionBox.jsx';
import Presentation from './components/Presentations.jsx';

var mediasoupApp = require("./mediasoupFirstApp.js");
var mediasoupObj;

$(document).ready(() => {
	let w = $('#videoCapture').width();
	let h = w/1.4;
	resizeVideo();
	var socket = io();
	mediasoupObj = new mediasoupApp(socket, $('#room').val());
	ReactDOM.render(<ConnectionBox con={socket}/>, document.getElementById('usersBox'));
	ReactDOM.render(<Presentation con={socket} width={w} height={h} />, document.getElementById('board'));
	mediasoupObj.join();
	window.onbeforeunload = () => {
		mediasoupObj.quit();
	}
	$('#sendPresentation').click(() => {
		let url = $('#urlPresentation').val();
		socket.emit('sendingPresentation', {key: $('#room').val(), val: url});
	});

	$('#formExit').submit(() => {
		mediasoupObj.quit()
			.then((condition) => {
					return condition;
			});
	});

});

	function resizeVideo() {
		let widthContainer = $('#videoCapture').width();
		console.log("ancho " + widthContainer);
		let heightContainer = widthContainer/1.4;
		console.log("alto " + heightContainer);
		$('#mediasoupVideo').attr('width', widthContainer);
		$('#mediasoupVideo').attr('height', heightContainer);
		$('#board').attr('width', widthContainer);
		$('#board').attr('height', heightContainer);
	}
