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

// Chatroom

var numUsers = -1;

io.on('connection', function(socket){
  // variable to track if the user is added or not
  var userAdded = false;

  // add a new user by username
  socket.on('new user added', function(userName) {
    // is the user added?
    if (userAdded) {
      return;
    }
    // store the username for this client
    socket.username = userName;
    ++numUsers;
    userAdded = true;
    socket.emit('loggedIn', {
      message: 'Welcome to the chat!',
      numUsers: numUsers
    });
    socket.broadcast.emit('new user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // chat message event, send out the msg to client
  socket.on('chat message', function(msg){
    io.emit('chat message', {
      username: socket.username,
      message: msg
    });
  });

  // update numUsers and send msg to client when a user has disconnected
  socket.on('disconnect', function() {
    if (userAdded) {
      --numUsers;

      // let everyone else know who left and how many users there are now
      socket.broadcast.emit('user disconnected', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

});
