const eventEmitter = require("events").EventEmitter;
const util = require("util");

function Receiver() {
  eventEmitter.call(this);
}

util.inherits(Receiver, eventEmitter);

Receiver.prototype.emitMessage = function(message) {
  this.emit("data", message);
};

module.exports = Receiver;
