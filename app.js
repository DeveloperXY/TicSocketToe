var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(3000, function () {
    console.log('App Started On port : 3000');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var players = {},
    unmatched;

io.on('connection', function (socket) {
    joinGame(socket);

    if (getOpponent(socket)) {
        socket.emit('gameBegin', {
            symbol: players[socket.id].symbol
        });

        getOpponent(socket).emit('gameBegin', {
            symbol: players[getOpponent(socket).id].symbol
        });
    }

    socket.on('makeMove', function (data) {

        if (!getOpponent(socket)) {
            return;
        }

        socket.emit('moveMade', data);
        getOpponent(socket).emit('moveMade', data);

    });

    socket.on('disconnect', function () {

        if (getOpponent(socket)) {
            getOpponent(socket).emit('opponentQuit');
        }

    });

});


function joinGame(socket) {
    players[socket.id] = {
        opponent: unmatched,
        symbol: 'X',
        socket: socket
    };
    if (unmatched) {
        players[socket.id].symbol = 'O';
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
        ].socket;
}