const { EventHubClient, EventPosition } = require("@azure/event-hubs");
const iothub = require("azure-iothub");
let ehClient;

function startService(options) {
  const { connectionString } = options;
  if (!connectionString) {
    throw new Error(
      "oops, you're missing a CONNECTION_STRING entry in ./.env!"
    );
  }

  const registry = iothub.Registry.fromConnectionString(connectionString);
  const client = iothub.Client.fromConnectionString(connectionString);
  return startHub(options).then(() => {
    return {
      listDevices: registry.list.bind(registry),
      callDeviceMethod: client.invokeDeviceMethod.bind(client)
    };
  });
}

function startHub(options) {
  return EventHubClient.createFromIotHubConnectionString(
    options.connectionString
  )
    .then(client => (ehClient = client))
    .then(() => ehClient.getPartitionIds())
    .then(partitionIds => filterPartitions(options, partitionIds))
    .then(partitionIds => generateReceivers(options, partitionIds));
}

function filterPartitions(options, partitionIds) {
  return partitionIds.filter(partitionId => {
    return (
      !options.partitionFilter.length ||
      options.partitionFilter.includes(partitionId)
    );
  });
}

function generateReceivers(options, partitionIds) {
  const { startTime, consumerGroup, receiveHandler, errorHandler } = options;

  const receiveOptions = {
    enqueuedTime: startTime,
    eventPosition: EventPosition.fromEnqueuedTime(startTime),
    consumerGroup: consumerGroup
  };

  return partitionIds.map(partitionId => {
    return ehClient.receive(
      partitionId,
      receiveHandler,
      errorHandler,
      receiveOptions
    );
  });
}

module.exports.startService = startService;
