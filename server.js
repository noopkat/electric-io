require("dotenv").config();
const path = require("path");
const http = require("http");
const debug = require("debug")("server");
const express = require("express");
const socket = require("socket.io");
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

const helpers = require("./lib/helpers");
const liveHub = require("./lib/liveHub");
const simHub = require("./lib/simHub");
const routes = require("./lib/routes.js");

// hub options
if (!process.env.IOTHUB_CONNECTION_STRING && process.env.CONNECTION_STRING) {
  console.error(
    "It looks like you recently upgraded electric-io and need to update your"
  );
  console.error("configuration.");
  console.error("");
  console.error(
    "Previous versions of electric-io required the IoT Hub connection string"
  );
  console.error("in the CONNECTION_STRING environment variable.");
  console.error("");
  console.error(
    "This version requires both the IoT Hub connection string and the Event"
  );
  console.error("Hub-compatible endpoint connection string:");
  console.error("  IOTHUB_CONNECTION_STRING=...");
  console.error("  EVENTHUB_CONNECTION_STRING=...");
  console.error("");
  console.error(
    "For more information about how to configure these connection strings, go to"
  );
  console.error(
    "https://github.com/noopkat/electric-io/blob/master/README.md#installation"
  );

  process.exit(1);
}
const iotHubConnectionString = process.env.IOTHUB_CONNECTION_STRING;
const eventHubConnectionString = process.env.EVENTHUB_CONNECTION_STRING;
const consumerGroup = process.env.CONSUMER_GROUP || "$Default";
const partitionFilter = process.env.PARTITION_FILTER || [];

// server options
const simulating = process.env.SIMULATING;
const platform = process.env.PLATFORM || "default";
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const socketOptions = platform === "azure" ? { perMessageDeflate: false } : {};
const io = socket(server, socketOptions);

function receiveHandler(message) {
  debug("firehose:", message.body);
  io.sockets.emit("message", message);
}

function errorHandler(error) {
  console.error(`there was a receiver error: ${error.toString()}`);
}

const hubOptions = {
  iotHubConnectionString,
  eventHubConnectionString,
  consumerGroup,
  partitionFilter,
  receiveHandler,
  errorHandler
};

const hub = simulating === "true" ? simHub : liveHub;

hub
  .startService(hubOptions)
  .then(startServer)
  .catch(error => {
    throw error;
  });

function startServer(hubService) {
  app.use(express.static(path.join(__dirname, "public")));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressSanitizer());
  app.use("/", routes({ io, hubService }));

  io.on("connection", function(socket) {
    debug("a user connected");
    socket.emit("hello");
  });

  helpers.createDashboardFileIfNotExists(function() {
    debug("starting express server...");
    server.listen(port, function() {
      console.log(`Server listening at port ${port}`);
    });
  });
}
