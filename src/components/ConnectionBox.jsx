import React from 'react';
import ReactDOM from 'react-dom';
import Elem from './TableElem.jsx';

export default class ConnectionBox extends React.Component {
	constructor(props) {
		super(props);
		this.childChangeState = this.childChangeState.bind(this);
		this.state = {users: [], actives: new Map()};
	}

	componentDidMount() {
		this.props.con.on('newUserConBox', (data) => {
			console.log(data);
			let mapStates = new Map(JSON.parse(data.states));
			this.setState({ users: data.users, actives: mapStates });
		});
		this.props.con.on('newUserState', (statesMap) => {
			let mapStates = new Map(JSON.parse(statesMap));
			this.setState({ users: this.state.users, actives: mapStates });
		});
	}

	childChangeState(params) {
		this.props.con.emit('newUserState', {name: params.name, state: params.state});
	}

	render() {
		var items = this.state.users;
		var actives = this.state.actives;
		var userType = $("#userType").val();
		return (
			<div className="scrollable">
				<table className="table table-hover">
					<tbody>

						{items.map((item, index) => {
							let elemState = actives.has(item) ? actives.get(item) : false;
							return (<Elem key={index} changeState={this.childChangeState} userType={userType} state={elemState} name={item} con={this.props.con} />)
						}
						)}

					</tbody>
				</table>
		</div>
		)
	}
}
