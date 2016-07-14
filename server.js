var fs = require('fs');
var http = require('http');
var https = require('https');
var io = require('socket.io')(http,{origins: '*:*'});
var privateKey  = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.key', 'utf8');
var certificate = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: 'hitoriaf'};
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.get('/', function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
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

httpServer.listen(8080);
httpsServer.listen(8443);
