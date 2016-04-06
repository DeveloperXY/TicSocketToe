var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;

server.listen(port, function () {
    console.log('App Started On port : ' + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var players = {},
    unmatched;

io.on('connection', function (socket) {
    console.log("A user joined the game.");
    joinGame(socket);
    // Once the socket has an opponent, we can begin the game
    if (getOpponent(socket)) {
        startNewGame(socket);
    }

    socket.on('makeMove', function (data) {

        if (!getOpponent(socket)) {
            return;
        }

        socket.emit('moveMade', data);
        getOpponent(socket).emit('moveMade', data);

    });

    socket.on('demandRematch', function () {
        socket.emit('rematchSent', {msg: "Rematch request sent !"});
        getOpponent(socket).emit('rematchRequest');
    });

    socket.on('rematchResponse', function (data) {
        if (data.response === true)
            startNewGame(socket);
        else
            getOpponent(socket).emit('rematchRejected');
    });

    socket.on('disconnect', function () {

        if (getOpponent(socket)) {
            getOpponent(socket).emit('opponentQuit');
        }

    });

});

/**
 * Starts a new game, emitting the 'gameBegin' event to both concerned sockets.
 */
function startNewGame(socket) {
    socket.emit('gameBegin', {
        symbol: players[socket.id].symbol
    });

    getOpponent(socket).emit('gameBegin', {
        symbol: players[getOpponent(socket).id].symbol
    });
}

function joinGame(socket) {
    // Add the player to our object of players
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

// Returns the opponent socket
function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
        ].socket;
}