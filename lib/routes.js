const routes = require("express").Router();
const debug = require("debug")("server");

const HubService = require("./services/hub.service.js");
const DashboardService = require("./services/dashboard.service.js");

function injectRoutes({ iotHubService }) {
  routes.get("/api/dashboard", async function(_request, response) {
    debug("LOG: Getting dashboard settings.");

    try {
      const dashboardSettings = await DashboardService.getDashboardSettings();

      response.status(200).json(dashboardSettings);
    } catch (error) {
      response.status(500).send({
        data: {
          message: error
        }
      });
    }
  });

  routes.post("/api/dashboard", async function(request, response) {
    debug("LOG: Saving dashboard settings.");

    try {
      await DashboardService.saveDashboardSettings(request.body);

      response.status(200).send();
    } catch (error) {
      response.status(500).send({
        data: {
          message: error
        }
      });
    }
  });

  routes.get("/api/devices/list", async function(_request, response) {
    debug("LOG: Getting device ID list.");

    try {
      const deviceIds = await HubService.getDeviceIds(iotHubService);
      response.status(200).send(deviceIds);
    } catch (error) {}
  });

  routes.post("/api/device/:deviceId/method/:deviceMethod", async function(
    request,
    response
  ) {
    debug(`LOG: Calling device method “${request.params.deviceMethod}”.`);

    const deviceData = {
      deviceId: request.params.deviceId,
      deviceMethodName: request.params.deviceMethod,
      deviceMethodPayload: request.body.callPayload
    };

    try {
      const responseBody = await HubService.callDeviceMethod(
        iotHubService,
        deviceData
      );
      response.status(200).json(responseBody);
    } catch (error) {
      response.status(500).send({
        data: {
          message: error
        }
      });
    }
  });

  routes.post("/api/device/:deviceId/message/", async function(
    request,
    response
  ) {
    debug("LOG: Calling device message.");

    const deviceData = {
      deviceId: request.params.deviceId,
      deviceMessagePayload: request.body.callPayload
    };

    try {
      const responseBody = await HubService.callDeviceMessage(
        iotHubService,
        deviceData
      );
      response.status(200).json(responseBody);
    } catch (error) {
      response.status(500).send({
        data: {
          message: error
        }
      });
    }
  });

  return routes;
}

module.exports = injectRoutes;
