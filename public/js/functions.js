$(document).ready(function() {
  var socket = io();
  $("#chat-screen").hide();

  // function to set username input
  function setUserName() {
    var userName = ($("#username-input").val().trim());
    if (userName) {
      $("#chat-screen").show();
      $("#login-screen").hide();
      // send new user added event to server
      socket.emit('new user added', userName);
    }
    return false;
  }

  $("#login-box").submit(function(e) {
    e.preventDefault();
    setUserName();
  });

  // when the form is submitted, emit input value
  $('#chatbox').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  // use enter to send a chat message
  $('#m').keypress(function(e) {
    if (e.which == 13 && !event.shiftKey) {
      e.preventDefault();
      $('#chatbox').submit();
    }
  });

  // when the message is received by the server, append it to an li
  socket.on('chat message', function(msg){
    $('#messages').append($('<li class="mdl-list__item">').text(msg.username + ': ' + msg.message));
  });

  socket.on('loggedIn', function(newUser) {
    $('.welcome-msg').text(newUser.message);
    if (newUser.numUsers == 0) {
      $('.numUsers-msg').text("There are no other users here.");
    }
    else if (newUser.numUsers == 1) {
      $('.numUsers-msg').text('There is 1 other user here.');
    }
    else {
      $('.numUsers-msg').text('There are ' + newUser.numUsers + ' other users here.');
    }
  });

  socket.on('new user joined', function(newUser) {
    $('#broadcast').append($('<p class="broadcast-msg">').text(newUser.username + ' has joined.'));
    if (newUser.numUsers == 1) {
      $('.numUsers-msg').text('There is 1 other user here.');
    }
    else {
      $('.numUsers-msg').text('There are ' + newUser.numUsers + ' other users here.');
    }
  });

  socket.on('user disconnected', function(userDc) {
    $('#broadcast').append($('<p class="broadcast-msg">').text(userDc.username + ' has left.'));
  });

})
