import React from 'react';
import ReactDOM from 'react-dom';


export default class RoomsView extends React.Component {
	constructor(props) {
		super(props);
		this.props.con.emit('adminConecting');
		this.getStatesRooms = this.getStatesRooms.bind(this);
		this.updateViewSubjectsList = this.updateViewSubjectsList.bind(this);
		this.state = {items: []}
	}
	componentDidMount() {
		$("[id='Panel Administración']").text('Entrar');
		$("[id='Panel Administración']").attr('class', 'badge badge-primary');
		this.getStatesRooms();
		this.interval = setInterval(() => this.getStatesRooms(), 1000);
	}

	componentWillUnmount() {
	  clearInterval(this.interval);
	}

	getStatesRooms() {
		this.socket = this.props.con;
		this.socket.emit('findAllSubjectsForUser', this.props.user, this.updateViewSubjectsList);
	}

	updateViewSubjectsList(data) {
			this.setState({items: data});
	}

	render() {
		var items = this.state.items;
		return (
			<table className="table table-bordered">
		  		<thead className="thead-dark">
		    		<tr>
		      			<th scope="col">Sala</th>
		      			<th scope="col">Nombre</th>
		      			<th scope="col">Estado</th>
		    		</tr>
		  		</thead>
				<tbody>
				{items.map((item, index) => {
					return (
						<tr key={index}>
							<th scope="row">
								{index}
							</th>
							<td>
								{item.name}
							</td>
							<td>
									{item.name == 'Panel Administración'
									?
									(<h4><a href={"/sala/" + item.name} className="badge badge-primary" id={item.name}>
										Entrar
									</a></h4>)
									:
									(<h4><a href={"/sala/" + item.name} className="badge badge-success" id={item.name}>
										Entrar <span class="badge badge-light">{item.connections}</span>
									</a></h4>)
									}
							</td>
						</tr>
					)
			})}
				</tbody>
			</table>

		)
	}
}

//ReactDOM.render(<RoomsView />, document.getElementById('root'));
