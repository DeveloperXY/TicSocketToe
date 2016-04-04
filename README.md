# TicSocketToe
___

## A Node.js Api for realtime/multiplayer tic-tac-toe game made with Socket.io
___

##### Specification : Every Client Side (Web/Mobile/Desktop) who wants to implements this Api has to be sure to :
___

+ Connect to the Socket.io running instance eg :
    ``` var socket = io.connect('http://localhost'); ```
+ Include the **socket.io.js** ( Especially in Web Implementation )

+ Import **JQuery** ( Web ) To ease the Dom Events handling

___

### Structure:
___

+ Board Game have to be composed of a **grid** of 3x3 buttons (or any other clickable elements) with *ids* from **a0** to **c2**
depending of their *horizontal* and *veritical* position ( these ids shall be those that will be used to get the coordinates
of the selected button)

+ You also needs to make a Label/Div with a specific ID to render the messages sent from the Node.js server

___

### Received Events:
___

+ ``` socket.on('gameBegin',callback) ``` : shows that another user (Socket) has connected to the server,
the method assigns the initial symbol to the current player ( with **data.symbol** variable sent from the server ) and starts the game

+ ``` socket.on('opponentQuit',callback) ``` : as indicated by its name, this event shows that your current opponent has disconnected
from the server, which means the cutoff of the current socket pooling (the method return no values)

+ ``` socket.on('moveMade',callback) ``` : a broadcast socket that signals that one of the players has made a move,
the **data** variable holds the **symbol** and the **position**, which eventually needs appropriate treatment depending of the use case
> eg:  append the **symbol** to the clicked button with the specified **position**
___

### Sent Events:
___

+ ``` socket.emit('moveMade',data) ``` : take two arguments :
    1. **symbol** : Either 'X' or 'Y'
    2. **position** : the id of the clicked button ( as specified in the above, the ids must be in range a0->c2)


> If you feel confused, clone the above example , run it ( ```npm start || node app``` ) , go to *localhost:3000*, connect two socket instances and just **PLAY**!
