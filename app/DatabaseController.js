'use strict';
var User = require('./models/users');
var Subjects = require('./models/subjects');

class DatabaseController {
    constructor(io, socketClient, adminId) {
        console.log("CREADO");
        this.userModel = User;
        this.subjectsModel = Subjects;
        this.connection = io;
        this.adminId = adminId;
        this.socket = socketClient;
        this.findAllUsers = this.findAllUsers.bind(this);
        this.findAllSubjects = this.findAllSubjects.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateUserRooms = this.updateUserRooms.bind(this);
        this.addUser = this.addUser.bind(this);
        this.socket.on('findUsers', this.findAllUsers);
        this.socket.on('findSubjects', this.findAllSubjects);
        this.socket.on('findUserByName', this.findUserByName);
        this.socket.on('findSubjectByName', this.findSubjectByName);
        this.socket.on('deleteUser', this.deleteUser);
        this.socket.on('updateUser', this.updateUser);
        this.socket.on('updateUserRooms', this.updateUserRooms);
        this.socket.on('createUser', this.addUser);
    }

    findAllUsers() {
        this.userModel.find((err, users) => {
            this.subjectsModel.populate(users, {path: "subjects"}, (err, usersSub) => {
                this.connection.sockets.connected[this.adminId].emit('userList', usersSub);
            })
        });
    }

    findUserByName(name) {
        this.userModel.find({userName: name}, (user) => {
            console.log(user);
        });
    }

    findAllSubjects() {
        this.subjectsModel.find((err, elems) => {
            this.connection.sockets.connected[this.adminId].emit('subjectList', elems);
        });
    }

    findSubjectByName(nameS) {
        this.subjectsModel.find({name: nameS}, (err, elems) => {
            console.log(elems);
        });
    }

    findSubjectsOnUser(name) {
        this.userModel.find({ username: name }, (err, user) => {
            if (err) throw err;
            this.subjectsModel.populate(user, {path: "subjects"}, (err, userS) => {
                console.log(userS[0].subjects);
            })
        });
    }

    deleteUser(id) {
        this.userModel.findByIdAndRemove(id, (err, user) => {
            if (err) return err;
            const msg = "Usuario " + user.username + " eliminado correctamen.";
            this.connection.sockets.connected[this.adminId].emit('deleted', msg);
        });
    }

    addUser(req) {
        console.log(req);
        const newUser = new this.userModel(req);
        newUser.save((err) => {
            if (err) {
                return err;
            }
            else {
                this.connection.sockets.connected[this.adminId].emit('updatedUser');
            }

        })
    }

    addSubject(req) {
        const newSubject = new this.subjectsModel(req);
        newSubject.save((err) => {
            if (err) return err;
        });
    }

    updateUser(data) {
        console.log(data);
        this.userModel.findOneAndUpdate({_id: data.id}, {
            "$set": {
                "username": data.username,
                "email": data.email,
                "userType": data.userType
            }
        }).exec((err, user) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                this.connection.sockets.connected[this.adminId].emit('updatedUser');
            }
        });
    }

    updateUserRooms(data) {
        console.log(data);

        this.userModel.findOneAndUpdate({_id: data.idUser}, {
            "$set": {
                "subjects": data.idRooms
            }
        }).exec((err, user) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                this.connection.sockets.connected[this.adminId].emit('updatedUser');
            }
        });
    }
}


module.exports = DatabaseController;
