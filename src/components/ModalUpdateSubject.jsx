import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalUpdateSubject extends React.Component {

    constructor(props) {
        super(props);
        this.parentMethod = this.parentMethod.bind(this);
    }

    parentMethod() {
        let data = {
            id: $('#inputIdSubject').val(),
            name: $('#inputNameSubject').val(),
            space: $('#inputSpaceSubject').val(),
            connections: $('#inputConnectionsSubject').val()
        }
        this.props.update(data);
    }

    render() {
        return (
            <div className="modal fade" id="updateSubjectModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-tittle">Modificar sala</h5>
                        </div>
                        <div className="modal-body">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Nombre</span>
                                </div>
                                <input type="text" id="inputNameSubject" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Límite</span>
                                </div>
                                <input type="text" id="inputSpaceSubject" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                <input id="inputIdSubject" type="hidden" />
                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Conexiones</span>
                                </div>
                                <input type="text" id="inputConnectionsSubject" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                <input id="inputIdSubject" type="hidden" />
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
