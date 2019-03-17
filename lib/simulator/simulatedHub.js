const simulatedDeviceList = require("./simulatedDeviceList").list;

function Registry() {}

Registry.prototype.list = function(callback) {
  return callback(null, simulatedDeviceList);
};

function Client() {}

Client.prototype.invokeDeviceMethod = function(
  deviceId,
  methodParams,
  callback
) {
  return callback(null, { status: 200 });
};

var hub = {
  Client: {},
  Registry: {}
};

hub.Client.fromConnectionString = function() {
  return new Client();
};

hub.Registry.fromConnectionString = function() {
  return new Registry();
};

module.exports = hub;
