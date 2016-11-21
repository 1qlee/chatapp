// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Set the view engine to HTML files
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

io.on('connection', function(socket){
  socket.emit('connected message', 'You are now connected');

  socket.on('disconnect', function() {
    console.log('A user has disconnected.');
  });

  socket.on('new user joined', function() {
    console.log('A new user has joined.');
    socket.broadcast.emit('new user message', "A new user has joined.")
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg);
  });


});
