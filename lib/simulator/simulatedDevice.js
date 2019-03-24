function simulatedDevice(receiver, id, telemetry) {
  this.receiver = receiver;
  this.id = id;
  this.telemetry = telemetry;
}

simulatedDevice.prototype.start = function() {
  this.interval = setInterval(() => {
    var body = {};
    this.telemetry.properties.forEach(prop => {
      const [min, max] = prop.minmax;
      body[prop.name] = Math.random() * (max - min) + min;
    });
    const annotations = {
      "iothub-connection-device-id": this.id,
      "iothub-enqueuedtime": new Date()
    };
    const message = { annotations, body };

    this.receiver.emitMessage(message);
  }, this.telemetry.interval);
};

simulatedDevice.prototype.stop = function() {
  clearInterval(this.interval);
};

module.exports = simulatedDevice;
