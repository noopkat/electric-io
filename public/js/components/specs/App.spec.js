import { mount, shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from 'jest-axe';

import App from "../App";
import * as configFns from "../../lib/configuration";
import { TITLE_EMOJI_REGEX } from "../../utils/constants.js";


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
  },
  deviceList: ["AZ3166", "Tessel2", "Jenn"]
};

// Shallow mount App component as reusable function for tests
function shallowMountComponent(props = {}) {
  return shallowMount(App, {
    propsData: {
      ...props
    },

    data() {
      return {
        ...mockDashboardData
      };
    }
  });
}

expect.extend(toHaveNoViolations);

describe("App", () => {
  test("Component can be mounted", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("Child components can be mounted", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.find({ name: "DashboardSettings" }).exists()).toBe(true);
    expect(wrapper.find({ name: "BaseCard" }).exists()).toBe(true);
  });

  test("Default data is clean", () => {
    const { vm } = shallowMount(App);

    expect(vm.dashboard.blockSize).toEqual([]);
    expect(vm.dashboard.tiles).toEqual([]);
    expect(vm.messages).toEqual([]);
    expect(vm.deviceList).toEqual([]);
    expect(vm.simulating).toEqual(SIMULATING);
  });

  test("Title style is based on the computed property headingStyle", () => {
    const wrapper = shallowMountComponent();
    expect(wrapper.vm.headingStyle).toEqual({ color: "#000" });

    // Test whether `headingStyle` fallback color is used
    wrapper.setData({
      dashboard: {
        bgColor: "hsl(270, 50%, 80%)",
        bgImageUrl: "http://test",
        bgImageRepeat: false
      }
    });
    expect(wrapper.vm.headingStyle).toEqual({ color: "#000" });
  });

  test("DashboardSettings are shown based on computed property showSettings", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.showSettings).toEqual(true);
    expect(wrapper.find({ name: "DashboardSettings" }).exists()).toBe(true);

    wrapper.vm.dashboard.editMode = "locked";

    expect(wrapper.vm.showSettings).toEqual(false);
    expect(wrapper.find({ name: "DashboardSettings" }).exists()).toBe(false);
  });

  test("compute the appTitle with or without an emoji using the TITLE_EMOJI_REGEX constant", () => {
    const { vm } = shallowMountComponent();

    const title = TITLE_EMOJI_REGEX.exec(mockDashboardData.dashboard.title);
    title[1] = "\u2700";
    title[2] = "IoT Dashboard";

    expect(vm.appTitle).toEqual(
      `<span class="hemoji">${title[1]}</span> ${title[2]}`
    );
  });

  test("onSaveSettings method", () => {
    jest.spyOn(configFns, "saveDashboard");
    const wrapper = shallowMountComponent();

    wrapper.vm.dashboard.editMode = "unlocked";

    wrapper.find({ name: "DashboardSettings" }).vm.$emit("save-settings", {
      bgColor: "#fff",
      bgImageRepeat: true,
      bgImageUrl: "",
      title: "\u2700 IoT Dashboard"
    });

    expect(wrapper.vm.dashboard).toEqual(
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
    expect(configFns.saveDashboard).toHaveBeenCalled();
  });

  test("onTileChange method", () => {
    const { vm } = shallowMountComponent();

    expect(vm.dashboard).toEqual(mockDashboardData.dashboard);

    mockDashboardData.dashboard.tiles[0].buttonText = "stop it";

    vm.onTileChange(event => {
      event.id = mockDashboardData.dashboard.tiles[0].id;
    });

    expect(vm.dashboard.tiles[0]).toEqual({
      buttonText: "stop it",
      deviceId: "AZ3166",
      deviceMethod: "stop",
      id: "2471d5ab-0d73-42a3-ba4f-f694574feb6b",
      position: [54, 466],
      size: [0.8, 0.7],
      title: "MXChip sending",
      type: "button"
    });

    expect(vm.dashboard.tiles.length).toBe(2);
  });

  test("onTileDelete method", () => {
    const wrapper = shallowMountComponent();
    const tileId = mockDashboardData.dashboard.tiles[0].id;

    wrapper.vm.onTileDelete(tileId);

    expect(
      wrapper.find({ name: "BaseCard" }).vm.$emit("tile-delete")
    ).toBeTruthy();

    expect(wrapper.vm.dashboard.tiles.length).toBe(1);
  });

  test("onTileCreate method", () => {
    jest.spyOn(configFns, "saveDashboard");
    const wrapper = shallowMountComponent();

    wrapper.find({ name: "DashboardSettings" }).vm.$emit("tile-create", {
      deviceId: "",
      id: "2ece272b-a403-46d6-b136-e35906fe1d0d",
      lineColor: "#FF6384",
      position: [0, 0],
      property: "",
      size: [2, 1.5],
      title: "Line Chart",
      type: "line-chart"
    });

    expect(configFns.saveDashboard).toHaveBeenCalled();
    expect(wrapper.vm.dashboard.tiles.length).toBe(3);
  });

  test("onDeviceListReceived method", () => {
    const { vm } = shallowMountComponent();
    let deviceList;

    vm.onDeviceListReceived(deviceList);

    expect(deviceList).toEqual(vm.deviceList);

    // TODO: test socket.on callback function
  });

  test("the getDashboard and getDeviceList are invoked in the created lifecycle hook", () => {
    jest.spyOn(configFns, "getDashboard");
    jest.spyOn(configFns, "getDeviceList");
    mount(App);

    expect(configFns.getDashboard).toHaveBeenCalled();
    expect(configFns.getDeviceList).toHaveBeenCalled();
  });

  test("verify component is accessible", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
