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

var io = require('socket.io')(httpServer,{origins: '*:*'});

//var ioclient = require('socket.io-client')('https://services.hitoriaf.com:8443');
var ioclient = require('socket.io-client')('http://localhost:8080');

/*
 * Mongo DB Connect
 */
var mongojs = require('mongojs');
var databaseUrl = "services.hitoriaf.com/socket_server",
    collections = ["user", "pesan"],
    db          = mongojs(databaseUrl, collections);
db.on("connect", function(){
  console.log("database connected to " + databaseUrl);
});
db.on('error', function (err) {
	console.log('database error', err)
})
/** The Program Starts Here **/

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
  app.post('/getchat', function(req,res){
    var body = req.body;
    db.pesan.find({}, function(error,data){
      res.json(data);
    });
  });
  app.post('/send_socket',function(req,res){
    var body = req.body;
    console.log(body);
    var type = body.utype;
    var message = {
                    message : body.message
                    ,icon : body.image_url
                  };
    ioclient.emit(type,message,function(callback){
      res.send(message);
    });
  });

});

io.on('connection', function(socket){
  console.log('user connected, id ' + socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('register_client', function(msg){
    var userid = msg.userid;
    console.log("registered user " + userid + "id : " + socket.id);
  });
  socket.on('chat', function(msg, callback){
    db.pesan.save(msg, function(error, message){
      if(error){
        console.log(error);
        callback(error);
      }
      console.log("save chat message");
      console.log(msg);
      io.emit('chat', msg);
      callback("sukses");
    });
  });
  socket.on('notif_all', function(msg, callback){
    io.emit('notif_all', msg);
    callback("sukses");
  });
  socket.on("lock", function(msg){
    console.log(msg);
    io.emit("lock",msg);
  });
});

httpServer.listen(8080);
httpsServer.listen(8443);
