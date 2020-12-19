const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

const path = require("path");
const http = require("http");
const debug = require("debug")("server");
const express = require("express");
const socket = require("socket.io");
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

const DashboardService = require("./lib/services/dashboard.service.js");
const DashboardMigrationService = require("./lib/services/dashboard-migrations.service.js");
const createDashboardFileIfItDoesNotExist = require("./lib/utilities/createDashboardFileIfItDoesNotExist.js");
const liveHub = require("./lib/liveHub.js");
const simHub = require("./lib/simHub.js");
const routes = require("./lib/routes.js");

// hub options
const connectionString = process.env.CONNECTION_STRING;
const consumerGroup = process.env.CONSUMER_GROUP || "$Default";
const partitionFilter = process.env.PARTITION_FILTER || [];

// server options
const simulating = process.env.SIMULATING || "true";
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
  connectionString,
  consumerGroup,
  partitionFilter,
  receiveHandler,
  errorHandler
};

const hub = simulating === "true" ? simHub : liveHub;

async function startServer(iotHubService) {
  app.use(express.static(path.join(__dirname, "public")));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressSanitizer());
  app.use("/", routes({ iotHubService }));

  io.on("connection", function(socket) {
    debug("a user connected");
    socket.emit("hello");
  });

  // Make sure that the dashboard file is not modified and server is not started when running tests.
  if (process.env.NODE_ENV !== "test") {
    try {
      const result = await createDashboardFileIfItDoesNotExist();
      console.info(result.message);
      console.info(`Your dashboard file is stored at “${result.filePath}”.`);

      const dashboardSettings = await DashboardService.getDashboardSettings();
      const wasUpgraded = DashboardMigrationService.upgradeDashboard(
        dashboardSettings
      );
      if (wasUpgraded) {
        console.info(
          `Your dashboard was upgraded to version ${dashboardSettings.version}`
        );
        await DashboardService.saveDashboardSettings(dashboardSettings);
      }
    } catch (error) {
      debug(error);
      console.error(error);
    }

    // Note: This is `server.listen` intentionally. When using `app.listen`, it breaks socket.io.
    server.listen(port, function() {
      console.info(
        `The hub server is now awake and listening at port ${port}.`
      );
    });
  }
}

async function startHubServer() {
  console.info("Starting the hub server …");

  try {
    const iotHubService = await hub.startService(hubOptions);
    startServer(iotHubService);
  } catch (error) {
    console.error("Could not start the hub server.");
    throw error;
  }
}

startHubServer();

module.exports = app;
