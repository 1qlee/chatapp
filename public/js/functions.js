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

  // broadcast that a user has connected to everyone else
  socket.on('connect message', function(msg){
    $('#broadcast').append($('<h2>').text(msg));
  });

})
