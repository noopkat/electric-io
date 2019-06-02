import { mount, shallowMount } from "@vue/test-utils";
import App from "../App";
import { TITLE_EMOJI_REGEX } from "./../../utils/constants.js";

// Mock dashboard data
const mockDashboardData = {
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
  }
};

// Mock device data
const mockDeviceList = ["AZ3166", "Tessel2", "Jenn"];

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("if child components mount", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.find({ name: "dashboard-settings" }).exists()).toBe(true);
    expect(wrapper.find({ name: "base-card" }).exists()).toBe(true);
  });

  test("check before component is created that the default data is clean", () => {
    const { vm } = shallowMount(App);

    expect(vm.dashboard.blockSize).toEqual([]);
    expect(vm.dashboard.tiles).toEqual([]);
    expect(vm.messages).toEqual([]);
    expect(vm.deviceList).toEqual([]);
    expect(vm.simulating).toEqual(process.env.SIMULATING);
  });

  test("computed value returned from dashStyle computed method", () => {
    const { vm } = shallowMountApp();

    vm.dashboard.bgImageRepeat = mockDashboardData.dashboard.bgImageRepeat;

    expect(vm.dashStyle).toEqual({
      backgroundColor: vm.dashboard.bgColor,
      backgroundImage: vm.dashboard.bgImageUrl,
      backgroundRepeat: "repeat"
    });

    vm.dashboard.bgImageRepeat = false;

    expect(vm.dashStyle).toEqual({
      backgroundColor: vm.dashboard.bgColor,
      backgroundImage: vm.dashboard.bgImageUrl,
      backgroundRepeat: "no-repeat"
    });
  });

  test("h1 heading style based upon headingStyle computed method", () => {
    const { vm } = shallowMountApp();

    expect(vm.headingStyle).toEqual({ color: "#000" });
  });

  test("don't display dashboard-settings based upon showSettings computed method", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.vm.showSettings).toEqual(true);

    wrapper.vm.dashboard.editMode = "locked";

    expect(wrapper.vm.showSettings).toEqual(false);
    expect(wrapper.find({ name: "dashboard-settings" }).exists()).toBe(false);
  });

  test("comput the appTitle with or without an emoji using the TITLE_EMOJI_REGEX constant", () => {
    const { vm } = shallowMountApp();
    const title = TITLE_EMOJI_REGEX.exec(mockDashboardData.dashboard.title);

    title[1] = "\u2700";
    title[2] = "IoT Dashboard";

    expect(vm.appTitle).toEqual(
      `<span class="hemoji">${title[1]}</span> ${title[2]}`
    );
  });

  test("onSaveSettings method", () => {
    const { vm } = shallowMountApp();

    expect(vm.dashboard).toEqual(
      expect.objectContaining({
        bgColor: expect.any(String),
        bgImageRepeat: expect.any(Boolean),
        bgImageUrl: expect.any(String),
        blockSize: expect.any(Array),
        editMode: expect.any(String),
        tiles: expect.any(Array),
        title: expect.any(String)
      })
    );

    vm.onSaveSettings(() => {
      expect(vm.saveDashboard).toHaveBeenCalled();
    });

    Vue.nextTick(() => {
      expect(vm.dashboard).toEqual(
        expect.objectContaining({
          bgColor: expect.any(String),
          bgImageRepeat: expect.any(Boolean),
          bgImageUrl: expect.any(String),
          blockSize: expect.any(Array),
          editMode: expect.any(String),
          tiles: expect.any(Array),
          title: expect.any(String)
        })
      );
    });
  });

  test("onTileChange method", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.vm.dashboard).toEqual(mockDashboardData.dashboard);

    mockDashboardData.dashboard.tiles[0].buttonText = "stop it";

    wrapper.vm.onTileChange(event => {
      event.id = mockDashboardData.dashboard.tiles[0].id;
      expect(vm.saveDashboard).toHaveBeenCalled();
    });

    expect(wrapper.vm.dashboard.tiles[0]).toEqual({
      buttonText: "stop it",
      deviceId: "AZ3166",
      deviceMethod: "stop",
      id: "2471d5ab-0d73-42a3-ba4f-f694574feb6b",
      position: [54, 466],
      size: [0.8, 0.7],
      title: "MXChip sending",
      type: "button"
    });
  });

  test("onTileDelete method", () => {
    const wrapper = shallowMountApp();
    const tileId = mockDashboardData.dashboard.tiles[0].id;
    const updatedTiles = mockDashboardData.dashboard.tiles.filter(
      tile => tile.id !== tileId
    );

    wrapper.vm.onTileDelete(tileId);

    expect(
      wrapper.find({ name: "base-card" }).vm.$emit("tile-delete")
    ).toBeTruthy();

    mockDashboardData.dashboard = Object.assign(
      {},
      mockDashboardData.dashboard,
      {
        tiles: updatedTiles
      }
    );

    expect(mockDashboardData.dashboard.tiles.length).toBe(1);
  });

  test("onTileCreate method", () => {
    const wrapper = shallowMountApp();

    wrapper.vm.onTileCreate(event => {
      event = {
        buttonText: "begin",
        deviceId: "DH7643",
        deviceMethod: "halt",
        id: "8071d5ab-0z12-41i3-ba9p-f600124feb6b",
        position: [106, 266],
        size: [0.9, 0.3],
        title: "MSchip receiving",
        type: "button"
      };

      const updatedTiles = mockDashboardData.dashboard.tiles.slice();

      updatedTiles.push(event);

      mockDashboardData.dashboard = Object.assign(
        {},
        mockDashboardData.dashboard,
        {
          tiles: updatedTiles
        }
      );

      expect(mockDashboardData.dashboard.tiles.length).toBe(3);
    });
  });

  test("onDeviceListRecieved method", () => {
    const wrapper = shallowMountApp();
    const io = jest.fn();
    const socket = io();

    wrapper.vm.onDeviceListReceived(() => {
      expect(socket).toHaveBeenCalled();
    });
  });

  test("the getDashboard and getDeviceList functions in the created lifecycle hook", () => {
    const wrapper = mount(App, {
      methods: {
        getDashboard: () => mockDashboardData.dashboard,
        getDeviceList: () => mockDeviceList
      }
    });

    expect(wrapper.vm.getDashboard()).toEqual(mockDashboardData.dashboard);
    expect(wrapper.vm.getDeviceList()).toEqual(mockDeviceList);
  });
});

// Mock mounting configuration
const mountingConfiguration = {
  data: () => ({
    dashboard: mockDashboardData.dashboard,
    deviceList: mockDeviceList
  })
};

// Shallow mount App component as reusable function for tests
function shallowMountApp() {
  return shallowMount(App, mountingConfiguration);
}
