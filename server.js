var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var privateKey  = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.key', 'utf8');
var certificate = fs.readFileSync('hitoriaf.com-cert/hitoriafcom.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: 'hitoriaf'};
var express = require('express');
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var io = require('socket.io')(httpsServer,{origins: '*:*'});

var ioclient = require('socket.io-client')('https://services.hitoriaf.com:8443');


app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
ioclient.on('connect', function(){
  console.log("Socket Client Activated");
  app.get('/', function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send('Keep Calm, Its Active');
  });
  app.post('/send_socket',function(req,res){
    var message = req.body.message;
    ioclient.emit("chat",message,function(callback){
      console.log(callback);
      res.send(callback);
    });
  });

});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat', function(msg, callback){
    console.log('message: ' + msg);
    io.emit('chat', "hai hai");
    callback("apapun");
  });
  socket.on('coba', function(msg){
    console.log('Message Coba : ' + msg);
  });
});

httpServer.listen(8080);
httpsServer.listen(8443);
