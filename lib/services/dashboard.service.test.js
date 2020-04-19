const fs = require("fs");

const DashboardService = require("./dashboard.service.js");

const mockDashboardSettings = {
  dashboard: {
    bgColor: "#808900",
    bgImageRepeat: "true",
    bgImageUrl: "",
    blockSize: [250, 200],
    title: "\u2700 IoT Dashboard",
    tiles: [
      {
        buttonText: "stop",
        deviceId: "AZ3166",
        deviceMethod: "stop",
        id: "2471d5ab-0d73-42a3-ba4f-f694574feb6b",
        position: [54, 466],
        size: [0.8, 0.7],
        title: "MXChip sending",
        type: "button"
      },
      {
        id: "84de1d0d-d1ae-4daa-9540-179e9dd4155c",
        position: [50, 730],
        size: [1, 1],
        title: "",
        type: "sticker",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"
      }
    ],
    editMode: "unlocked"
  },
  deviceList: ["AZ3166", "Tessel2", "Jenn"]
};

describe("DashboardService", () => {
  let BACKUP_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...BACKUP_ENV };
    process.env.EDIT_MODE = "unlocked";

    jest.restoreAllMocks();
  });

  afterEach(() => {
    process.env = BACKUP_ENV;
  });

  test("can read dashboard settings", async () => {
    jest
      .spyOn(fs, "readFile")
      .mockImplementation((_path, _options, callback) => {
        callback(undefined, JSON.stringify(mockDashboardSettings));
      });

    const dashboardSettings = await DashboardService.getDashboardSettings();

    expect(dashboardSettings).toEqual(mockDashboardSettings);
  });

  test("can’t read dashboard settings if fs.readFile produces an error", async () => {
    jest
      .spyOn(fs, "readFile")
      .mockImplementation((_path, _options, callback) => {
        const error = {};
        callback(error, undefined);
      });

    try {
      await DashboardService.getDashboardSettings();
    } catch (error) {
      expect(error).toContain("Could not read from file");
    }
  });

  test("can’t read dashboard settings if JSON is invalid", async () => {
    jest
      .spyOn(fs, "readFile")
      .mockImplementation((_path, _options, callback) => {
        const invalidJsonString = "{";
        callback(undefined, invalidJsonString);
      });

    try {
      await DashboardService.getDashboardSettings();
    } catch (error) {
      expect(error).toContain("Could not parse the contents of");
    }
  });

  test("can save dashboard settings", async () => {
    jest
      .spyOn(fs, "writeFile")
      .mockImplementation((_path, _data, _options, callback) => {
        callback(undefined);
      });

    const dashboardSettings = await DashboardService.saveDashboardSettings(
      mockDashboardSettings
    );

    expect(dashboardSettings).toEqual(mockDashboardSettings);
  });

  test("can’t save dashboard in demo mode", async () => {
    const DEMO_MODE = "demo";
    process.env.EDIT_MODE = DEMO_MODE;

    const NewDashboardServive = require("./dashboard.service.js");
    // Make sure we don’t actually write to the current “dashboard.json” file.
    jest
      .spyOn(fs, "writeFile")
      .mockImplementation((_path, _data, _options, callback) => {
        callback(undefined);
      });

    try {
      await NewDashboardServive.saveDashboardSettings(mockDashboardSettings);
    } catch (error) {
      expect(error).toContain(`Can’t save dashboard in ${DEMO_MODE} mode.`);
    }
  });

  test("can’t save dashboard settings if fs.writeFile produces an error", async () => {
    jest
      .spyOn(fs, "writeFile")
      .mockImplementation((_path, _data, _options, callback) => {
        const error = {};
        callback(error);
      });

    try {
      await DashboardService.saveDashboardSettings(mockDashboardSettings);
    } catch (error) {
      expect(error).toContain("Could not write to");
    }
  });
});
