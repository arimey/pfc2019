import React from 'react';
import ReactDOM from 'react-dom';
import ChangeUserModal from './ModalUpdateUser.jsx';
import ChangeSubjectModal from './ModalUpdateSubject.jsx';
import CreateUserModal from './ModalCreateUser.jsx';
import UpdateRoomsModal from './ModalUpdateUserRooms.jsx';
import AddRoomModal from './ModalAddRoom.jsx';

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props)

        this.updateViewUserList = this.updateViewUserList.bind(this);
        this.updateViewSubjectsList = this.updateViewSubjectsList.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.showServerMsg = this.showServerMsg.bind(this);
        this.showUpdatePanel = this.showUpdatePanel.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateSubject = this.updateSubject.bind(this);
        this.updateUserRooms = this.updateUserRooms.bind(this);
        this.createUser = this.createUser.bind(this);
        this.showUpdateRooms = this.showUpdateRooms.bind(this);
        this.showUpdateSubjectPanel = this.showUpdateSubjectPanel.bind(this);
        this.addRoom = this.addRoom.bind(this);
        this.deleteSubject = this.deleteSubject.bind(this);
        this.state = {users: [], subjects: [], showModal: false};
        this.triggerChildCheckboxUpdate = this.triggerChildCheckboxUpdate.bind(this);
    }

    componentDidMount() {
        this.socket = this.props.con;
        this.socket.emit('adminConecting');
        this.socket.emit('findUsers');
        this.socket.emit('findSubjects');
        this.socket.on('userList', this.updateViewUserList);
        this.socket.on('subjectList', this.updateViewSubjectsList);
        this.socket.on('deleted', this.showServerMsg);
        this.socket.on('updatedUser', this.showServerMsg);
        this.socket.on('updatedSubjects', this.showServerMsg);
    }



    updateViewUserList(data) {
        this.setState({users: data, subjects: this.state.subjects});

    }

    updateViewSubjectsList(data) {
        this.setState({users: this.state.users, subjects: data});
    }

    deleteUser(e, item) {
        this.socket.emit('deleteUser', item._id);
    }

    deleteSubject(e, item) {
        this.socket.emit('deleteSubject', item._id);
    }

    showServerMsg(msg) {
        this.socket.emit('findUsers');
        this.socket.emit('findSubjects');
        alert(msg);
    }

    updateUser(data) {
        this.socket.emit('updateUser', data);
    }

    updateSubject(data) {
        this.socket.emit('updateSubject', data);
    }

    addRoom(data) {
        this.socket.emit('addRoom', data);
    }

    updateUserRooms(data) {
        this.socket.emit('updateUserRooms', data);
    }

    createUser(data) {
        this.socket.emit('createUser', data);
    }

    showUpdatePanel(userData) {
        $('#inputId').val(userData._id);
        $('#inputName').val(userData.username);
        $('#inputMail').val(userData.email);
    }

    showUpdateSubjectPanel(subjectData) {
        $('#inputIdSubject').val(subjectData._id);
        $('#inputNameSubject').val(subjectData.name);
        $('#inputSpaceSubject').val(subjectData.space);
        $('#inputConnectionsSubject').val(subjectData.connections);
    }

    showUpdateRooms(userData) {
        $('#userIdForRoom').val(userData._id);
        this.triggerChildCheckboxUpdate(userData.subjects);
    }

    triggerChildCheckboxUpdate(subjects) {
        this.refs.updateRoomsChild.updateCheckbox(subjects);
    }

    render() {
        var users = this.state.users;
        var subjects = this.state.subjects;
        return (
            <div>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr className="elems-align">
                            <th scope="align-middle col" colspan="5">USUARIOS</th>
                        </tr>
                    </thead>
                    <thead className="thead-dark">
                        <tr className="elems-align">
                            <th scope="align-middle col">Nombre</th>
                            <th scope="align-middle col">Correo</th>
                            <th scope="align-middle col">Tipo</th>
                            <th scope="align-middle col">Salas</th>
                            <th scope="align-middle col">U D</th>
                        </tr>
                    </thead>

                    <tbody>
                    {users.map((item, index) => {
                        return(
                        <tr className="elems-align" key={index}>
                            <td className="align-middle">
                                {item.username}
                            </td>
                            <td className="align-middle">
                                {item.email}
                            </td>
                            <td className="align-middle">
                                {item.userType}
                            </td>
                            <td className="align-middle">
                                <div className="row align-items-center">
                                    <div className="col-10">
                                        <select className="form-control">
                                            {item.subjects.map((item1, index1) => {
                                                return(<option key={index1}>{item1.name}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-2">
                                        <span className="fas fa-plus fa-2x pointer-span" data-toggle="modal" data-target="#updateRooms" onClick={((e) => this.showUpdateRooms(item))}></span>
                                    </div>
                                </div>
                            </td>
                            <td className="align-middle">
                                <div className="row justify-content-center">
                                    <div className="col-4">
                                        <span className="far fa-edit fa-2x pointer-span" data-toggle="modal" data-target="#updateModal" onClick={((e) => this.showUpdatePanel(item))}></span>
                                    </div>
                                    <div className="col-4">
                                        <span className="fas fa-eraser fa-2x pointer-span" onClick={((e) => this.deleteUser(e, item))}></span>
                                    </div>
                                </div>

                            </td>
                        </tr>
                        )
                    })}
                    </tbody>
                    <div>
                        <br />
                    </div>
                    <thead className="thead-dark">
                        <tr className="elems-align">
                            <th scope="align-middle" colspan="5">SALAS</th>
                        </tr>
                    </thead>
                    <thead className="thead-dark">
                        <tr className="elems-align">
                            <th scope="align-middle" colspan="3">Nombre</th>
                            <th scope="align-middle" colspan="1">Capacidad</th>
                            <th scope="align-middle" colspan="1">U D</th>
                        </tr>
                    </thead>
                    <tbody>
                    {subjects.map((item, index) => {
                        return(
                        <tr className="elems-align" key={index}>
                            <td className="align-middle" colspan="3">
                                {item.name}
                            </td>
                            <td className="align-middle" colspan="1">
                                {item.space}
                            </td>
                            <td className="align-middle">
                                <div className="row justify-content-center">
                                    <div className="col-4">
                                        <span className="far fa-edit fa-2x pointer-span" data-toggle="modal" data-target="#updateSubjectModal" onClick={((e) => this.showUpdateSubjectPanel(item))}></span>
                                    </div>
                                    <div className="col-4">
                                        <span className="fas fa-eraser fa-2x pointer-span" onClick={((e) => this.deleteSubject(e, item))}></span>
                                    </div>
                                </div>

                            </td>
                        </tr>
                        )
                    })}
                    </tbody>

                </table>
                <div className="row">
                    <div className="offset-md-5 col-md-4">
                        <button type="button" className="btn btn-outline-dark btn-block" data-toggle="modal" data-target="#createModal">Nuevo Usuario</button>
                    </div>
                </div>
                <div className="row">
                    <div className="offset-md-5 col-md-4">
                        <button type="button" className="btn btn-outline-dark btn-block" data-toggle="modal" data-target="#addRoomModal">Nueva Sala</button>
                    </div>
                </div>

                <ChangeUserModal update={this.updateUser} />
                <ChangeSubjectModal update={this.updateSubject} />
                <CreateUserModal create={this.createUser} />
                <UpdateRoomsModal ref="updateRoomsChild" updateUserRooms={this.updateUserRooms} subjects={this.state.subjects} />
                <AddRoomModal addRoom={this.addRoom} />
            </div>
        )
    }
}
