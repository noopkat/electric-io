const HubService = require("./hub.service.js");

const mockDeviceList = [
  { deviceId: "AZ3166" },
  { deviceId: "Tessel2" },
  { deviceId: "Jenn" }
];

describe("HubService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("get list of device IDs", async () => {
    const iotHubService = {
      listDevices: jest.fn().mockImplementation(callback => {
        const error = undefined;
        callback(error, mockDeviceList);
      })
    };

    const mockDeviceIds = mockDeviceList.map(device => device.deviceId);

    const deviceIds = await HubService.getDeviceIds(iotHubService);
    expect(deviceIds).toEqual(mockDeviceIds);
  });

  test("can call device method with valid stringified JSON payload", async () => {
    const iotHubService = {
      callDeviceMethod: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = undefined;
          const result = {};
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMethodName: "methodName",
      deviceMethodPayload: "{\"key\":\"value\"}" // prettier-ignore
    };

    const result = await HubService.callDeviceMethod(iotHubService, deviceData);
    expect(result).toEqual({
      data: {
        message: `Successfully invoked method ${deviceData.deviceMethodName} on ${deviceData.deviceId}.`
      }
    });
  });

  test("can’t call device method with *invalid* stringified JSON payload", async () => {
    const iotHubService = {
      callDeviceMethod: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = undefined;
          const result = {};
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMethodName: "methodName",
      deviceMethodPayload: "{"
    };

    try {
      await HubService.callDeviceMethod(iotHubService, deviceData);
    } catch (error) {
      expect(error).toBe("Could not parse method payload JSON.");
    }
  });

  test("can call device method with empty string as the payload", async () => {
    const iotHubService = {
      callDeviceMethod: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = undefined;
          const result = "";
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMethodName: "methodName",
      deviceMethodPayload: {}
    };

    const result = await HubService.callDeviceMethod(iotHubService, deviceData);
    expect(result).toEqual({
      data: {
        message: `Successfully invoked method ${deviceData.deviceMethodName} on ${deviceData.deviceId}.`
      }
    });
  });

  test("can’t call device method if hub service produces an error", async () => {
    const iotHubService = {
      callDeviceMethod: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = {};
          const result = undefined;
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMethodName: "methodName",
      deviceMethodPayload: { key: "value" }
    };

    try {
      await HubService.callDeviceMethod(iotHubService, deviceData);
    } catch (error) {
      expect(error).toEqual(
        `Failed to invoke method ${deviceData.deviceMethodName}.`
      );
    }
  });

  test("can call device message with valid stringified JSON payload", async () => {
    const iotHubService = {
      callDeviceMessage: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = undefined;
          const result = {};
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMessagePayload: "{\"key\":\"value\"}" // prettier-ignore
    };

    const result = await HubService.callDeviceMessage(
      iotHubService,
      deviceData
    );
    expect(result).toEqual({
      data: {
        message: `Successfully queued message on ${deviceData.deviceId}.`
      }
    });
  });

  test("can’t call device message with *invalid* stringified JSON payload", async () => {
    const iotHubService = {
      callDeviceMessage: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = undefined;
          const result = {};
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMessagePayload: "{" // prettier-ignore
    };

    try {
      await HubService.callDeviceMessage(iotHubService, deviceData);
    } catch (error) {
      expect(error).toBe("Could not parse message payload JSON.");
    }
  });

  test("can call device message with empty string as payload", async () => {
    const iotHubService = {
      callDeviceMessage: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = undefined;
          const result = {};
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMessagePayload: ""
    };

    const result = await HubService.callDeviceMessage(
      iotHubService,
      deviceData
    );
    expect(result).toEqual({
      data: {
        message: `Successfully queued message on ${deviceData.deviceId}.`
      }
    });
  });

  test("can’t call device message if hub service produces an error", async () => {
    const iotHubService = {
      callDeviceMessage: jest
        .fn()
        .mockImplementation((_deviceId, _methodParams, callback) => {
          const error = {};
          const result = undefined;
          callback(error, result);
        })
    };

    const deviceData = {
      deviceId: "AZ3166",
      deviceMessagePayload: { key: "value" }
    };

    try {
      await HubService.callDeviceMessage(iotHubService, deviceData);
    } catch (error) {
      expect(error).toBe("Failed to queue message.");
    }
  });
});
