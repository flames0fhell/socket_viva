var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('Keep Calm, Its Active');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat', function(msg, callback){
    console.log('message: ' + msg);
    callback(msg);
  });
});
http.listen(2549, function(){
  console.log('listening on *:2549');
});
