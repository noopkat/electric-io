const iothub = require('azure-iothub');

module.exports = function(connectionString) {
  return {
    registry: iothub.Registry.fromConnectionString(connectionString),
    client: iothub.Client.fromConnectionString(connectionString),
    Receiver: require('azure-iothub-receiver')
  };
};
