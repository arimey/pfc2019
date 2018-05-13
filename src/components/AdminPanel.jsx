import React from 'react';
import ReactDOM from 'react-dom';

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props)

        this.updateUserList = this.updateUserList.bind(this);
        this.updateSubjectsList = this.updateSubjectsList.bind(this);
        this.state = {users: [], subjects: []};
    }

    componentDidMount() {
        this.socket = this.props.con;
        this.socket.emit('adminConecting');
        this.socket.emit('findUsers');
        this.socket.on('userList', this.updateUserList);
        this.socket.on('subjectList', this.updateSubjectsList);
    }

    updateUserList(data) {
        this.setState({users: data, subjects: this.state.subjects});
        console.log(data);
    }

    updateSubjectsList(data) {
        this.setState({users: this.state.users, subjects: data});
        console.log(data);
    }

    render() {
        var items = this.state.users;
        return (
            <div>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Salas</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => {
                        return(
                        <tr key={index}>
                            <th scope="row">
                                {item.username}
                            </th>
                            <td>
                                {item.email}
                            </td>
                            <td>
                                {item.userType}
                            </td>
                            <td>
                                <select className="form-control">
                                    {item.subjects.map((item1, index1) => {
                                        return(<option key={index1}>{item1.name}</option>)
                                    })}
                                </select>
                            </td>
                            <td>
                                <i className="far fa-edit"></i>
                            </td>
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}
