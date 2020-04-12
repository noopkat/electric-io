require("dotenv").config();
const routes = require("express").Router();
const debug = require("debug")("server");
const fs = require("fs");
const path = require("path");

const editMode = process.env.EDIT_MODE || "unlocked";

function injectRoutes({ io, hubService }) {
  routes.get("/api/devices/list", function(req, res) {
    debug("device list requested");
    hubService.listDevices((error, list) => {
      const names = list.map(d => d.deviceId);
      debug(error, names);
      res.send(names);
    });
  });

  routes.get("/api/dashboard", function(req, res) {
    debug("dashboard requested");

    const localDashboardPathSegment = path.join(".data", "dashboard.json");

    fs.readFile(
      path.join(__dirname, "..", localDashboardPathSegment),
      { encoding: "utf8" },
      (error, data) => {
        debug(data, error);

        if (error) {
          const message = `Could not read from file “${localDashboardPathSegment}”.`;

          return res.status(500).send({
            data: { message }
          });
        } else {
          try {
            let jsonData = JSON.parse(data);
            jsonData.dashboard.editMode = editMode;

            return res.status(200).send(JSON.stringify(jsonData));
          } catch (error) {
            const message = `Could not parse the contents of “${localDashboardPathSegment}” as JSON.`;

            return res.status(500).send({
              data: { message }
            });
          }
        }
      }
    );
  });

  routes.post("/api/dashboard", function(req, res) {
    debug("dashboard save requested");

    const excludedModes = ["locked", "demo"];
    if (excludedModes.includes(editMode)) {
      const message = `Can’t save dashboard in ${editMode} mode.`;
      debug(message);

      return res.status(500).send({
        data: { message }
      });
    }

    const localDashboardPathSegment = path.join(".data", "dashboard.json");
    const fileContents = `{ "dashboard": ${JSON.stringify(req.body)} }`;

    fs.writeFile(
      path.join(__dirname, "..", localDashboardPathSegment),
      fileContents,
      "utf8",
      error => {
        if (error) {
          const message = `Could not write to “${localDashboardPathSegment}”.`;
          debug(message);

          return res.status(500).send({
            data: { message }
          });
        } else {
          const message = "Dashboard saved.";
          debug(message);

          return res.status(200).send({
            data: { message }
          });
        }
      }
    );
  });

  routes.post("/api/device/:deviceId/method/:deviceMethod", function(req, res) {
    debug(`Device method ${req.params.deviceMethod} requested`);
    const payloadExists = req.body.callPayload && req.body.callPayload.length;

    let payload;

    try {
      payload = payloadExists ? JSON.parse(req.body.callPayload) : {};
    } catch (error) {
      const message = "Could not parse method payload JSON.";
      debug(message);

      return res.status(500).send({
        data: { message }
      });
    }

    const methodParams = {
      methodName: req.params.deviceMethod,
      payload,
      timeoutInSeconds: 30
    };

    hubService.callDeviceMethod(req.params.deviceId, methodParams, function(
      error,
      result
    ) {
      if (error) {
        const message = `Failed to invoke method ${methodParams.methodName}.`;
        console.error(`${message} ${error.toString()}`);

        return res.status(500).send({
          data: { message }
        });
      } else {
        const message = `Successfully invoked method ${methodParams.methodName} on ${req.params.deviceId}.`;
        debug(message);
        debug(JSON.stringify(result, null, 2));

        return res.status(200).send({
          data: { message }
        });
      }
    });
  });

  routes.post("/api/device/:deviceId/message/", function(req, res) {
    debug("Device message requested");
    const payloadExists = req.body.callPayload && req.body.callPayload.length;
    const payload = payloadExists ? JSON.parse(req.body.callPayload) : {};

    hubService.callDeviceMessage(
      req.params.deviceId,
      JSON.stringify(payload),
      function(error, result) {
        if (error) {
          const message = "Failed to queue message.";
          console.error(`${message} ${error.toString()}`);

          return res.status(500).send({
            data: { message }
          });
        } else {
          const message = `Successfully queued message on ${req.params.deviceId}.`;
          debug(message);
          debug(JSON.stringify(result, null, 2));

          return res.status(200).send({
            data: { message }
          });
        }
      }
    );
  });

  return routes;
}

module.exports = injectRoutes;
