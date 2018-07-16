import React from 'react';
import ReactDOM from 'react-dom';

export default class ToolsBox extends React.Component {
	constructor(props) {
		super(props);
		//this.state = {presentation: ""}

	}

	componentDidMount() {
        $('#messageSendButton').click(() => {
            let data = $('#messageInput').val();
            let name = $('#userName').val();
            if (data.length > 0) {
                console.log(data);
                this.props.con.emit('chat message', {msg: data, user: name, room: $('#room').val()});
                $('#messageInput').val('');
            }
        });
        $('#messageInput').keypress((event) => {
            let data = $('#messageInput').val();
            let name = $('#userName').val();
            if (event.which == 13) {
                this.props.con.emit('chat message', {msg: data, user: name, room: $('#room').val()});
                $('#messageInput').val('');
            }
        });
        $('#turnOnAll').click(() => {
            this.props.con.emit('openAllPeers', {room: $('#room').val(), user: $('#userName').val()});
        });
        $('#turnOffAll').click(() => {
            this.props.con.emit('closeAllPeers', {room: $('#room').val(), user: $('#userName').val()});
        });
        $('#getTurn').click(() => {
            this.props.con.emit('getTurn', {room: $('#room').val(), user: $('#userName').val()});
        });
	}
	render() {
        var userPermission = this.props.permission;
		return (
            <div className="row">
                <div id="divInputChat" className="col-md-8 col-lg-8">
                    <div className="input-group">
                        <input id="messageInput" type="text" className="form-control" placeholder="Introduce texto a enviar..." />
                        <span className="input-group-btn">
                            <button id="messageSendButton" className="btn" type="button">Enviar</button>
                        </span>
                    </div>
                </div>
                {userPermission == "Profesor" ?
                    <div className="col-md-4 col-lg-4 text-center">

                        <button id="presentation" type="button" className="btn btn-outline-secondary" data-toggle="modal" data-target="#srcPresentation">Presentación</button>
                    </div>
                    :
                    <div className="col-md-4 col-lg-4 text-center">
                        <button id="getTurn" type="button" className="btn btn-outline-secondary">Petición</button>
                    </div>}
            </div>
		)
	}
}
