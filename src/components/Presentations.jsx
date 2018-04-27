import React from 'react';
import ReactDOM from 'react-dom';

export default class Presentation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {presentation: ""}
	}

	componentDidMount() {
		this.props.con.on('newPresentation', (urlPresentation) => {
            console.log(urlPresentation);
			this.setState({ presentation: urlPresentation });
		});
	}
	render() {
		var item = this.state.presentation;

		return (
            <div className="noMargin">
                {item == "" ?
                    <div className="alert alert-info align-middle" display="inline-block" role="alert">
                        No ha cargado ninguna presentación.
                    </div>
                :
                    <iframe src={item} width={this.props.width} height={this.props.height} frameBorder="0" allowFullScreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                }
            </div>
		)
	}
}
