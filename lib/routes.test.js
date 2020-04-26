const request = require("supertest");

const app = require("../server.js");
const DashboardService = require("./services/dashboard.service.js");
const HubService = require("./services/hub.service.js");

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
  version: 1
};

const mockDeviceIds = ["AZ3166", "Tessel2", "Jenn"];

describe("API endpoints", () => {
  describe("DashboardService endpoints", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    test("can get dashboard settings", async () => {
      jest
        .spyOn(DashboardService, "getDashboardSettings")
        .mockImplementation(() => Promise.resolve(mockDashboardSettings));

      const response = await request(app).get("/api/dashboard");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDashboardSettings.dashboard);
    });

    test("can’t get dashboard settings if the service produces an error", async () => {
      const errorMessage = "error";
      jest
        .spyOn(DashboardService, "getDashboardSettings")
        .mockImplementation(() => Promise.reject(errorMessage));

      const response = await request(app).get("/api/dashboard");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        data: {
          message: errorMessage
        }
      });
    });

    test("can save dashboard settings", async () => {
      jest
        .spyOn(DashboardService, "saveDashboardSettings")
        .mockImplementation(() => Promise.resolve(mockDashboardSettings));

      const response = await request(app)
        .post("/api/dashboard")
        .send(mockDashboardSettings.dashboard);

      expect(response.status).toBe(200);
    });

    test("can’t save dashboard settings when fs.writeFile results in an error", async () => {
      jest
        .spyOn(DashboardService, "saveDashboardSettings")
        .mockImplementation(() =>
          Promise.reject("Could not write to dashboard.json.")
        );

      const response = await request(app)
        .post("/api/dashboard")
        .send(mockDashboardSettings.dashboard);

      expect(response.status).toBe(500);
      expect(response.body.data.message).toContain("Could not write to");
    });
  });

  describe("HubService endpoints", () => {
    test("can get list of device IDs", async () => {
      jest
        .spyOn(HubService, "getDeviceIds")
        .mockImplementation(() => Promise.resolve(mockDeviceIds));

      const response = await request(app).get("/api/devices/list");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDeviceIds);
    });

    test("can call method on device", async () => {
      const deviceId = "deviceId";
      const deviceMethod = "deviceMethod";
      const devicePayload = {};
      const someResponse = "some response";

      jest
        .spyOn(HubService, "callDeviceMethod")
        .mockImplementation(() => Promise.resolve(someResponse));

      const response = await request(app)
        .post(`/api/device/${deviceId}/method/${deviceMethod}`)
        .send(devicePayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(someResponse);
    });

    test("can’t call method on device if the service produces an error", async () => {
      const deviceId = "deviceId";
      const deviceMethod = "deviceMethod";
      const devicePayload = {};
      const errorMessage = `Failed to invoke method ${deviceMethod}.`;

      jest
        .spyOn(HubService, "callDeviceMethod")
        .mockImplementation(() => Promise.reject(errorMessage));

      const response = await request(app)
        .post(`/api/device/${deviceId}/method/${deviceMethod}`)
        .send(devicePayload);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        data: {
          message: errorMessage
        }
      });
    });

    test("can queue message on device", async () => {
      const deviceId = "deviceId";
      const devicePayload = {};
      const someResponse = "some response";

      jest
        .spyOn(HubService, "callDeviceMessage")
        .mockImplementation(() => Promise.resolve(someResponse));

      const response = await request(app)
        .post(`/api/device/${deviceId}/message`)
        .send(devicePayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(someResponse);
    });

    test("can’t queue message on device if the service produces an error", async () => {
      const deviceId = "deviceId";
      const devicePayload = {};
      const errorMessage = "Failed to queue message.";

      jest
        .spyOn(HubService, "callDeviceMessage")
        .mockImplementation(() => Promise.reject(errorMessage));

      const response = await request(app)
        .post(`/api/device/${deviceId}/message`)
        .send(devicePayload);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        data: {
          message: errorMessage
        }
      });
    });
  });
});
