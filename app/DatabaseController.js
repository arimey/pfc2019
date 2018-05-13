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
        this.socket.on('findUsers', this.findAllUsers);
        this.socket.on('findUserByName', this.findUserByName);
        this.socket.on('findSubjectByName', this.findSubjectByName);
    }

    findAllUsers() {
        console.log("LLEGUE");
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
            console.log(elems);
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

    addUser(req) {
        const newUser = new this.userModel(req);
        newUser.save((err) => {
            if (err) return err;
        })
    }

    addSubject(req) {
        const newSubject = new this.subjectsModel(req);
        newSubject.save((err) => {
            if (err) return err;
        });
    }
}


module.exports = DatabaseController;
