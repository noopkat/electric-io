const iothub = require("./simulator/simulatedHub");
const Receiver = require("./simulator/simulatedReceiver");
const Simulator = require("./simulator/runSimulator");

function startService(options) {
  const registry = iothub.Registry.fromConnectionString();
  const client = iothub.Client.fromConnectionString();
  const receiver = new Receiver();
  const simulator = new Simulator(receiver);
  simulator.start();
  receiver.on("data", options.receiveHandler);

  return new Promise((resolve, reject) => {
    resolve({
      listDevices: registry.list,
      callDeviceMethod: client.invokeDeviceMethod,
      callDeviceMessage: client.callDeviceMessage
    });
  });
}

module.exports.startService = startService;
