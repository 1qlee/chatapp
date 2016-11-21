$(document).ready(function() {
  var socket = io();

  // when the form is submitted, emit input value
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  // when the message is received by the server, append it to an li
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('connected message', function(newUser) {
    $('#welcome').append($('<h3>').text(newUser)).delay(1500).fadeOut(300);
  });

  socket.on('connect', function() {
    socket.emit('new user joined');
  });

  socket.on('new user message', function(msg) {
    $('#broadcast').append($('<h3>').text(msg));
  });

})
