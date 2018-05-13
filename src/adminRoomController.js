import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import AdminPanel from './components/AdminPanel.jsx';

$(document).ready(() => {
    var socket = io();
    ReactDOM.render(<AdminPanel con={socket} />, document.getElementById('root'));
});
