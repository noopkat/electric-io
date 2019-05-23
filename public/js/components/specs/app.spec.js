import { mount, shallowMount } from "@vue/test-utils";
import App from "../App";

// Mock dashboard data
const mockDashboardData = {
  bgColor: "#808900",
  bgImageRepeat: "true",
  bgImageUrl: "",
  blockSize: [250, 200],
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
};

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

  test("don't display dashboard-settings based upon showSettings computed method", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.vm.showSettings).toEqual(true);

    wrapper.vm.dashboard.editMode = "locked";

    expect(wrapper.vm.showSettings).toEqual(false);
    expect(wrapper.find({ name: "dashboard-settings" }).exists()).toBe(false);
  });

  test("h1 heading style based upon headingStyle computed method", () => {
    const { vm } = shallowMountApp();

    expect(vm.headingStyle).toEqual({ color: "#000" });
  });
});

// Mock mounting configuration
const mountingConfiguration = {
  data: () => ({
    dashboard: mockDashboardData
  })
};

// Shallow mount App component as reusable function for tests
function shallowMountApp() {
  return shallowMount(App, mountingConfiguration);
}
