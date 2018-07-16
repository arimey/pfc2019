import React from 'react';
import ReactDOM from 'react-dom';

export default class Actives extends React.Component {
	constructor(props) {
		super(props);
        this.activateUser = this.activateUser.bind(this);
        this.desactivateUser = this.desactivateUser.bind(this);
        this.changeParentState = this.changeParentState.bind(this);
	}

    changeParentState(newCondition) {
        this.props.changeState({name: this.props.name, state: newCondition});
    }

	activateUser() {
        this.changeParentState(true);
	}

	desactivateUser() {
        this.changeParentState(false);
	}


	render() {
        var typeTeacher = this.props.userType === "Profesor";
        if (typeTeacher) {
            return(
    			this.props.state ?
    				(<tr className="table-success">
    					<td>
                            {this.props.name}

							<span className="fas fa-microphone-slash fa-lg float-right pointer-span" onClick={this.desactivateUser}></span>
							<span className="fas fa-microphone fa-lg float-right pointer-span" onClick={this.activateUser}></span>
    					</td>
    				</tr>)
    			:
    				(<tr>
    					<td>
    						{this.props.name}

							<span className="fas fa-microphone-slash fa-lg float-right pointer-span" onClick={this.desactivateUser}></span>
							<span className="fas fa-microphone fa-lg float-right pointer-span" onClick={this.activateUser}></span>
    					</td>
    				</tr>)
    		)
        }
        else {
            return(
    			this.props.state ?
    				(<tr className="table-success">
    					<td>
                            {this.props.name}
    					</td>
    				</tr>)
    			:
    				(<tr>
    					<td>
    						{this.props.name}
    					</td>
    				</tr>)
    		)
        }

	}
}
