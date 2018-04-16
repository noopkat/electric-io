const iothub = require('./simulator/simulatedHub');

module.exports = function(connectionString) {
  return {
    registry: iothub.Registry.fromConnectionString(connectionString),
    client: iothub.Client.fromConnectionString(connectionString),
    Receiver: require('./simulator/simulatedReceiver')
  };
};
