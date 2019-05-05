// TODO:  require an mqtt client library here

function startService(options) {
  const { url, user, password } = options;
  // TODO: check for existance of above option variables

  // the registry should be a client call to get all of the devices (maybe via either a client method, or by listing and examining the feeds
  const registry = iothub.Registry.fromConnectionString(connectionString);
  // this can be the regular client library connection client
  const client = iothub.Client.fromConnectionString(connectionString);

  return startHub(options).then(() => {
    return {
      listDevices: registry.list.bind(registry),
      // TODO: explore the best way to handle and fake device methods
      callDeviceMethod: client.invokeDeviceMethod.bind(client),
      callDeviceMessage: client.send.bind(client)
    };
  });
}

function startHub(options) {}

module.exports.startService = startService;
