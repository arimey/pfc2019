import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import ConnectionBox from './components/ConnectionBox.jsx';
import Presentation from './components/Presentations.jsx';
import ChatBox from './components/ChatBox.jsx';
import ToolsBox from './components/ToolsBox.jsx';

var mediasoupApp = require("./MediasoupRoomClient.js");
var mediasoupObj;

$(document).ready(() => {

	let w = $('#videoCaptureDiv').width();
	let h = w/1.4;
	var socket = io();
	let roomId = $('#room').val();
	resizeVideo(w, h);
	mediasoupObj = new mediasoupApp(socket, roomId);
	ReactDOM.render(<ConnectionBox con={socket}/>, document.getElementById('usersBox'));
	ReactDOM.render(<Presentation con={socket} width={w} height={h} />, document.getElementById('board'));
	ReactDOM.render(<ChatBox con={socket} />, document.getElementById('chatBox2'));
	ReactDOM.render(<ToolsBox con={socket} permission={$("#userType").val()} />, document.getElementById('divTools'));
	mediasoupObj.join();
	window.onbeforeunload = () => {
		mediasoupObj.quit();
	}


	$('#formExit').submit(() => {
		mediasoupObj.quit();
			/*.then((condition) => {
					return condition;
			});*/
	});

});

function resizeVideo(w, h) {
	console.log("ancho " + w);
	console.log("alto " + h);
	$('#mediasoupVideo').attr('width', w);
	$('#mediasoupVideo').attr('height', h);
	$('#board').attr('width', w);
	$('#board').attr('height', h);
}
