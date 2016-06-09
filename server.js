
// npm install -g nodemon
var express = require("express");
var morgan = require('morgan');
var http = require('http');
var app = express();
var sio = require('socket.io');
app.use(morgan('tiny'));

// Other modules
var fs = require('fs');

app.set('view engine', 'ejs');

// Handle static files
app.use(express.static(__dirname + '/public'));

// Hook up socket io
var httpServer = http.Server(app);
var io = sio(httpServer);

// Start server, default to localhost if openshift not found
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8000;
httpServer.listen(port, ipaddress, function() {console.log('Node server started on %s:%d', ipaddress, port);});


// -------------------------------------------------
// ROUTES / SOCKETIO

io.sockets.on('connection', function(socket) {

    socket.on('color', function(data) {
        socket.broadcast.emit('change color', {'color': data["color"], 'band': data["band"]});
        socket.emit('change color', {'color': data["color"], 'band': data["band"]});
    })


})

app.get("/", function(request, response) {
    response.render("index");
})