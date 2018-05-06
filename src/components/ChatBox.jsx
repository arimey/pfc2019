import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

export default class ChatBox extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		
		this.props.con.on('new message', (data) => {
			$('#messagesBox').append("<li class='list-group-item'>" + data.name + ": " + data.msg + "</li>");
			$('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
		});
	}
	render() {
		return (
			<div className="scrollable" id="chatBox">
				<ul id="messagesBox" className="list-group">
				</ul>
			</div>
		)
	}
}
