// TODO: break this file down into pieces so it's easier to digest
// ideas:
// 1. load routes from routes file
// 2. put routes handers in a file
// 3. put iot related work in a file
//
require('dotenv').config();
var express = require('express');
var fs = require('fs');
var http = require('http');
var socket = require('socket.io');
var helpers = require('./lib/helpers');
var liveHub = require('./lib/liveHub');
var simSub = require('./lib/simHub');
var Simulator = require('./lib/simulator/runSimulator');

var simulating = process.env.SIMULATING;
var connectionString = process.env.CONNECTION_STRING;
var consumerGroup = process.env.CONSUMER_GROUP || '$Default';
var editMode = process.env.EDIT_MODE || 'unlocked';

const receiverOptions = {
  connectionString,
  consumerGroup
};

// TODO: this can be deduped and written more cleverly
if (simulating === 'true') {
  var {registry, client, Receiver} = simSub(connectionString);
  var receiver = new Receiver(receiverOptions);
  const simulator = new Simulator(receiver);
  simulator.start();
} else {
  if (!connectionString) {
    console.error(new Error("oops, you're missing a CONNECTION_STRING entry in ./.env!"));
    process.exit();
  }
  var {registry, client, Receiver} = liveHub(connectionString);
  var receiver = new Receiver(receiverOptions);
}

var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socket(server);

helpers.createDashboardFileIfNotExists(function() {
  server.listen(port, function () {
    console.log('Server listening at port %d', port);
  });
});

// Routing
app.use(express.static('public'));
app.use(express.json());

app.get('/api/devices/list', function (req, res) {
  console.log('device list requested');
  registry.list((error, list) => {
    var names = list.map((d) => d.deviceId);
    console.log(error, names);
    res.send(names)
  });
});

app.get('/api/dashboard', function (req, res) {
  console.log('dashboard requested');
  fs.readFile(__dirname + '/.data/dashboard.json', {encoding: 'utf8'}, (err, data) => {
    console.log(data, err);
    let jsonData = JSON.parse(data);
    jsonData.dashboard.editMode = editMode;
    res.send(JSON.stringify(jsonData));    
  });
});

app.post('/api/dashboard', function (req, res) {
  console.log('dashboard save requested');
  const excludedModes = ['locked', 'demo'];
  if (excludedModes.includes(editMode)) return res.sendStatus(500);
  const fileContents = `{ "dashboard": ${JSON.stringify(req.body)} }`;
  fs.writeFile(__dirname + '/.data/dashboard.json', fileContents, 'utf8', (error) => {
    if (error) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

app.post('/api/device/:deviceId/method/:deviceMethod', function (req, res) {
  console.log('device method requested');
  var methodParams = {
    methodName: req.params.deviceMethod,
    payload: 'hello world',
    timeoutInSeconds: 30
  };

  client.invokeDeviceMethod(req.params.deviceId, methodParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
        res.sendStatus(500);
    } else {
        console.log(methodParams.methodName + ' on ' + req.params.deviceId + ':');
        console.log(JSON.stringify(result, null, 2));
        res.sendStatus(200);
    }
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('hello');
});

receiver.on('data', (message) => {
  io.sockets.emit('message', message);
});

receiver.on('error', (error) => {
  console.error(error);
});

