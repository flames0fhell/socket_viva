var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.key', 'utf8');
var certificate = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: 'hitoriaf'};
var express = require('express');
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var io = require('socket.io')(httpsServer,{origins: '*:*'});

app.get('/', function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send('Keep Calm, Its Active');
});
app.post('/send_socket',function(req,res){
  var message = req.params.message;
  io.emit('chat',message,callback);
  res.json({send:message, receive:callback});
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
  socket.on('coba', function(msg){
    console.log('Message Coba : ' + msg);
  });
});

httpServer.listen(8080);
httpsServer.listen(8443);
