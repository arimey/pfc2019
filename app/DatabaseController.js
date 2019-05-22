'use strict';
var User = require('./models/users');
var Subject = require('./models/subjects.js');

class DatabaseController {
    constructor(io, socketClient, adminId) {
        console.log("CREADO");
        this.userModel = User;
        this.subjectsModel = Subject;
        this.connection = io;
        this.adminId = adminId;
        this.socket = socketClient;
        this.findAllUsers = this.findAllUsers.bind(this);
        this.findAllSubjects = this.findAllSubjects.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.deleteSubject = this.deleteSubject.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateSubject = this.updateSubject.bind(this);
        this.updateUserRooms = this.updateUserRooms.bind(this);
        this.addUser = this.addUser.bind(this);
        this.addSubject = this.addSubject.bind(this);
        this.socket.on('findUsers', this.findAllUsers);
        this.socket.on('findSubjects', this.findAllSubjects);
        this.socket.on('findUserByName', this.findUserByName);
        this.socket.on('findSubjectByName', this.findSubjectByName);
        this.socket.on('deleteUser', this.deleteUser);
        this.socket.on('updateUser', this.updateUser);
        this.socket.on('updateSubject', this.updateSubject);
        this.socket.on('updateUserRooms', this.updateUserRooms);
        this.socket.on('createUser', this.addUser);
        this.socket.on('addRoom', this.addSubject);
        this.socket.on('deleteSubject', this.deleteSubject);
    }

    findAllUsers() {
        this.userModel.find((err, users) => {
            this.subjectsModel.populate(users, {path: "subjects"}, (err, usersSub) => {
                this.connection.sockets.connected[this.adminId].emit('userList', usersSub);
            })
        });
    }

    setAdminId(id) {
      this.adminId = id;
    }

    findUserByName(name) {
        this.userModel.find({userName: name}, (user) => {
            console.log(user);
        });
    }

    findAllSubjects() {
        this.subjectsModel.find((err, elems) => {
            console.log("Elementos de salas: ");
            console.log(elems);
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
            const msg = "Usuario " + user.username + " eliminado correctamente.";
            for (var i in this.connection.sockets.connected) {
                this.connection.sockets.connected[i].emit('deleted', msg);
            }
        });
    }

    deleteSubject(id) {
      console.log(this.subjectsModel);
        this.subjectsModel.findByIdAndRemove(id, (err, subject) => {
            if (err) return err;
            const msg = "Sala " + subject.name + " eliminada correctamente.";
            for (var i in this.connection.sockets.connected) {
                this.connection.sockets.connected[i].emit('deleted', msg);
            }
        });
    }

    addUser(req) {
        console.log(req);
        var msg = "Se ha creado el usuario " + req.username;
        const newUser = new this.userModel(req);
        newUser.save((err) => {
            if (err) {
                return err;
            }
            else {
                for (var i in this.connection.sockets.connected) {
                    this.connection.sockets.connected[i].emit('updatedUser', msg);
                }
            }

        })
    }

    addSubject(req) {
        const newSubject = new this.subjectsModel(req);
        newSubject.save((err) => {
            if (err) {
                return err;
            } else {
                this.findAllSubjects();
            }
        });
    }

    updateUser(data) {
        var msg = "Se ha actualizado la información del usuario";
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
                for (var i in this.connection.sockets.connected) {
                    this.connection.sockets.connected[i].emit('updatedUser', msg);
                }
            }
        });
    }

    updateSubject(data) {
      var msg = "Se ha actualizado la información de la sala.";
      this.subjectsModel.findOneAndUpdate({_id: data.id}, {
          "$set": {
              "name": data.name,
              "space": data.space,
              "connections": data.connections
          }
      }).exec((err, user) => {
          if (err) {
              console.log(err);
              return;
          }
          else {
              for (var i in this.connection.sockets.connected) {
                  this.connection.sockets.connected[i].emit('updatedSubjects', msg);
              }
          }
      });
    }

    updateUserRooms(data) {
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
                var msg = "Se han actualizado las salas del usuario.";
                for (var i in this.connection.sockets.connected) {
                    this.connection.sockets.connected[i].emit('updatedUser', msg);
                }
            }
        });
    }
}


module.exports = DatabaseController;
