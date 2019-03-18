const device = require("./simulatedDevice");
const devices = require("./simulatedDeviceList");
const deviceList = devices.list;
const telemetry = devices.telemetry;

function Simulator(receiver) {
  this.receiver = receiver;
  this.sims = [];
}

Simulator.prototype.start = function() {
  deviceList.forEach(d => {
    const sim = new device(this.receiver, d.deviceId, telemetry[d.deviceId]);
    this.sims.push(sim);
    sim.start();
  });
};

Simulator.prototype.stop = function() {
  this.sims.forEach(sim => sim.stop());
};

module.exports = Simulator;
