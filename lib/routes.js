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
    fs.readFile(
      path.join(__dirname, "..", ".data", "dashboard.json"),
      { encoding: "utf8" },
      (error, data) => {
        debug(data, error);
        if (error) return res.sendStatus(500);
        let jsonData = JSON.parse(data);
        jsonData.dashboard.editMode = editMode;
        res.send(JSON.stringify(jsonData));
      }
    );
  });

  routes.post("/api/dashboard", function(req, res) {
    debug("dashboard save requested");
    const excludedModes = ["locked", "demo"];
    if (excludedModes.includes(editMode)) return res.sendStatus(500);
    const fileContents = `{ "dashboard": ${JSON.stringify(req.body)} }`;
    fs.writeFile(
      path.join(__dirname, "..", ".data", "dashboard.json"),
      fileContents,
      "utf8",
      error => {
        if (error) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  });

  routes.post("/api/device/:deviceId/method/:deviceMethod", function(req, res) {
    debug(`Device method ${req.params.deviceMethod} requested`);
    const payloadExists =
      req.body.devicePayload && req.body.devicePayload.length;
    const payload = payloadExists ? JSON.parse(req.body.devicePayload) : {};
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
        console.error(
          `Failed to invoke method ${
            methodParams.methodName
          }: ${error.toString()}`
        );
        res.sendStatus(500);
      } else {
        debug(
          `Successful method call '${methodParams.methodName}' on ${
            req.params.deviceId
          }`
        );
        debug(JSON.stringify(result, null, 2));
        res.sendStatus(200);
      }
    });
  });

  return routes;
}

module.exports = injectRoutes;
