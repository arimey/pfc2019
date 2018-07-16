import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalUpdateUser extends React.Component {

    constructor(props) {
        super(props);
        this.parentMethod = this.parentMethod.bind(this);
    }

    parentMethod() {
        let data = {
            id: $('#inputId').val(),
            username: $('#inputName').val(),
            email: $('#inputMail').val(),
            userType: $('#typeUser option:selected').text()
        }
        this.props.update(data);
    }

    render() {
        return (
            <div className="modal fade" id="updateModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-tittle">Modificar usuario</h5>
                        </div>
                        <div className="modal-body">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Nombre</span>
                                </div>
                                <input type="text" id="inputName" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Correo</span>
                                </div>
                                <input type="text" id="inputMail" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                <input id="inputId" type="hidden" />
                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputType">Tipo</span>
                                </div>
                                <select className="custom-select" id="typeUser">
                                    <option defaultvalue>Escoge el tipo de usuario</option>
                                    <option value="1">Alumno</option>
                                    <option value="2">Profesor</option>
                                    <option value="3">Administrador</option>
                                </select>
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
