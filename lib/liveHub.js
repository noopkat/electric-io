const {
  EventHubConsumerClient,
  latestEventPosition
} = require("@azure/event-hubs");
const iothub = require("azure-iothub");

function startService(options) {
  const { iotHubConnectionString, eventHubConnectionString } = options;
  if (!iotHubConnectionString) {
    throw new Error(
      "oops, you're missing an IOTHUB_CONNECTION_STRING entry in ./.env!"
    );
  }
  if (!eventHubConnectionString) {
    throw new Error(
      "oops, you're missing an EVENTHUB_CONNECTION_STRING entry in ./.env!"
    );
  }

  const registry = iothub.Registry.fromConnectionString(iotHubConnectionString);
  const client = iothub.Client.fromConnectionString(iotHubConnectionString);
  return startHub(options).then(() => {
    return {
      listDevices: registry.list.bind(registry),
      callDeviceMethod: client.invokeDeviceMethod.bind(client),
      callDeviceMessage: client.send.bind(client)
    };
  });
}

function startHub(options) {
  const ehClient = new EventHubConsumerClient(
    options.consumerGroup,
    options.eventHubConnectionString
  );
  return ehClient
    .getPartitionIds()
    .then(partitionIds => filterPartitions(options, partitionIds))
    .then(partitionIds => generateReceivers(options, partitionIds, ehClient));
}

function filterPartitions(options, partitionIds) {
  return partitionIds.filter(partitionId => {
    return (
      !options.partitionFilter.length ||
      options.partitionFilter.includes(partitionId)
    );
  });
}

function generateReceivers(options, partitionIds, ehClient) {
  const { consumerGroup, receiveHandler, errorHandler } = options;

  const subscribeOptions = {
    startPosition: latestEventPosition,
    consumerGroup: consumerGroup
  };

  const eventHandlers = {
    processEvents: events => {
      events.forEach(e => receiveHandler(e));
    },
    processError: errorHandler
  };

  return partitionIds.map(partitionId => {
    return ehClient.subscribe(partitionId, eventHandlers, subscribeOptions);
  });
}

module.exports.startService = startService;
