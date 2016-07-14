var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

var fs = require('fs');

var privateKey = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.key');
var certificate = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.crt');

var credentials = {key: privateKey, cert: certificate};

var app = express.createServer(credentials);

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
