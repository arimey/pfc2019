import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalUpdateUser extends React.Component {

    constructor(props) {
        super(props);
        this.parentMethod = this.parentMethod.bind(this);
    }

    parentMethod() {
        let data = {
            username: $('#inputName1').val(),
            password: $('#inputPass1').val(),
            passwordConf: $('#inputPass1').val(),
            email: $('#inputMail1').val(),
            userType: $('#typeUser1 option:selected').text(),
        }
        this.props.create(data);
    }

    render() {
        return (
            <div className="modal fade" id="createModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-tittle">Crear usuario</h5>
                        </div>
                        <div className="modal-body">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Nombre</span>
                                </div>
                                <input type="text" id="inputName1" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Correo</span>
                                </div>
                                <input type="text" id="inputMail1" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />

                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Contraseña</span>
                                </div>
                                <input type="text" id="inputPass1" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputType">Tipo</span>
                                </div>
                                <select className="custom-select" id="typeUser1">
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
