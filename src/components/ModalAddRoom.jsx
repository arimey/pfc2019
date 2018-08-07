import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalAddRoom extends React.Component {

    constructor(props) {
        super(props);
        this.parentMethod = this.parentMethod.bind(this);
    }

    parentMethod() {
        let data = {
            name: $('#roomName').val(),
            space: 50,
            state: "Offline"
        }
        this.props.addRoom(data);
    }

    render() {
        return (
            <div className="modal fade" id="addRoomModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-tittle">Crear usuario</h5>
                        </div>
                        <div className="modal-body">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Nombre Sala</span>
                                </div>
                                <input type="text" id="roomName" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={this.parentMethod}>Guardar cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
