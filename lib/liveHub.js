const {
  EventHubConsumerClient,
  latestEventPosition
} = require("@azure/event-hubs");
const iothub = require("azure-iothub");
const { getEventHubConnectionString } = require("./azureIotHubManagement");

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
      callDeviceMethod: client.invokeDeviceMethod.bind(client),
      callDeviceMessage: client.send.bind(client)
    };
  });
}

function startHub(options) {
  let ehClient;
  return createEventHubConsumerClientFromIotHubConnectionString(options)
    .then(client => (ehClient = client))
    .then(() => ehClient.getPartitionIds())
    .then(partitionIds => filterPartitions(options, partitionIds))
    .then(partitionIds => generateReceivers(options, partitionIds, ehClient));
}

function createEventHubConsumerClientFromIotHubConnectionString(options) {
  return getEventHubConnectionString(options.connectionString).then(
    eventHubConnectionString =>
      new EventHubConsumerClient(
        options.consumerGroup,
        eventHubConnectionString
      )
  );
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
