const debug = require("debug")("server");

module.exports = {
  getDeviceIds(iotHubService) {
    return new Promise(resolve => {
      iotHubService.listDevices((error, deviceList) => {
        // TODO: Maybe we should check if `error` is defined and reject with fitting error message.
        const deviceIds = deviceList.map(device => device.deviceId);
        debug(error, deviceIds);
        resolve(deviceIds);
      });
    });
  },

  callDeviceMethod(
    iotHubService,
    { deviceId, deviceMethodName, deviceMethodPayload }
  ) {
    return new Promise((resolve, reject) => {
      let payload;

      if (
        typeof deviceMethodPayload === "string" &&
        deviceMethodPayload.length > 0
      ) {
        try {
          payload = JSON.parse(deviceMethodPayload);
        } catch (error) {
          const message = "Could not parse method payload JSON.";
          debug(`ERROR: ${message}`);

          reject(message);
        }
      } else {
        payload = {};
      }

      const methodParams = {
        methodName: deviceMethodName,
        payload,
        timeoutInSeconds: 30
      };

      iotHubService.callDeviceMethod(deviceId, methodParams, function(
        error,
        result
      ) {
        if (error) {
          const message = `Failed to invoke method ${deviceMethodName}.`;
          debug(`ERROR: ${message} ${error.toString()}`);

          reject(message);
        } else {
          const message = `Successfully invoked method ${deviceMethodName} on ${deviceId}.`;
          debug(`LOG: ${message}`);
          debug(JSON.stringify(result, null, 2));

          resolve({
            data: { message }
          });
        }
      });
    });
  },

  callDeviceMessage(iotHubService, { deviceId, deviceMessagePayload }) {
    return new Promise((resolve, reject) => {
      let payload;
      if (deviceMessagePayload && deviceMessagePayload.length > 0) {
        try {
          payload = JSON.parse(deviceMessagePayload);
        } catch (error) {
          const message = "Could not parse message payload JSON.";
          debug(`ERROR: ${message}`);

          reject(message);
        }
      } else {
        payload = {};
      }

      iotHubService.callDeviceMessage(
        deviceId,
        JSON.stringify(payload),
        function(error, result) {
          if (error) {
            const message = "Failed to queue message.";
            debug(`${message} ${error.toString()}`);

            reject(message);
          } else {
            const message = `Successfully queued message on ${deviceId}.`;
            debug(message);
            debug(JSON.stringify(result, null, 2));

            resolve({
              data: { message }
            });
          }
        }
      );
    });
  }
};
