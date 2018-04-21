import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

export default class ConnectionBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {users: []}
	}

	componentDidMount() {
		this.props.con.on('newUserConBox', (users) => {
			this.setState({ users: users });
		});
	}
	render() {
		var items = this.state.users;

		return (
			<div>
				<ul className="list-group">
					{items.map((item, index) =>

						<li key={index} className="list-group-item">
							{item}
						</li>

					)}

			</ul>
		</div>
		)
	}
}
