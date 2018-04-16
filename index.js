// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var emitter = null;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));


io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('hello');
  
});

var Receiver = require('azure-iothub-receiver');

const options = {
  connectionString: process.env.CONNECTION_STRING,
  consumerGroup: 'glitch'
};

var receiver = new Receiver(options);


receiver.on('data', (message) => {
  if (message.annotations['iothub-connection-device-id'] !== 'deviceMagpie') return;
  console.log('annotations:', message.annotations);
  console.log('body:', message.body);
  io.sockets.emit('temp', message.body);
});


receiver.on('error', (error) => {
  console.error(error);
});

