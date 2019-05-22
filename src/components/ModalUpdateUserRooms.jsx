import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalUpdateRooms extends React.Component {

    constructor(props) {
        super(props);
        this.parentMethod = this.parentMethod.bind(this);
        this.updateCheckbox = this.updateCheckbox.bind(this);
    }

    parentMethod() {
        let rooms = $('#roomValues').find('input');
        let roomsArray = [];

        $.map(rooms, (item, index) => {
            if (item.checked) {
                roomsArray.push(item.value);
            }
        });
        let data = {
            idUser: $('#userIdForRoom').val(),
            idRooms: roomsArray
        }
        this.props.updateUserRooms(data);
    }

    updateCheckbox(subjects) {
      $('#roomValues input').prop('checked', false);
      subjects.map((subject, index) => {
          $('#' + subject._id).prop('checked', true);
      });
    }

    render() {
        return (
            <div className="modal fade" id="updateRooms" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-tittle">Añadir salas</h5>
                        </div>
                        <div className="modal-body" id="roomValues">
                            {this.props.subjects.map((itemx, indexx) => {
                                return(
                                    <div className="form-check" >
                                        <input className="form-check-input" type="checkbox" value={itemx._id} id={itemx._id} />
                                        <label className="form-check-label" for={indexx}>
                                            {itemx.name}
                                        </label>
                                    </div>
                                )
                            })}
                            <input id="userIdForRoom" type="hidden" />
                            <input id="subjectsForUser" type="hidden" />
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
