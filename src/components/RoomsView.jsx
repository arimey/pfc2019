import React from 'react';
import ReactDOM from 'react-dom';


class RoomsView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {items: []}
	}
	componentDidMount() {

	}
	render() {
		var items = this.props.subjects;
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
						<tr>
							<th scope="row">
								{index}
							</th>
							<td>
								{item.name}
							</td>
							<td>
								{(this.props.permission == 2 || this.props.permission == 1) ?
									item.state == "Offline" ?
										<h4><a href={"/sala/" + item.name} className="badge badge-dark">
											{item.state}
										</a></h4>
									:
										<h4><a href={"/sala/" + item.name} className="badge badge-primary">
											{item.state}
										</a></h4>
								:
									item.state == "Offline" ?
										<h4><span className="badge badge-pill badge-dark">
											{item.state}
										</span></h4>
									:
										<h4><a href={"/sala/" + item.name} className="badge badge-primary">
											{item.state}
										</a></h4>

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

export default RoomsView;

//ReactDOM.render(<RoomsView />, document.getElementById('root'));
