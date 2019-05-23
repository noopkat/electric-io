import { mount, shallowMount } from "@vue/test-utils";
import App from "../App";
import BaseCard from "../BaseCard";
import DashboardSettings from "../DashboardSettings";

const mockDashboardData = {
  dashboard: {
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
  }
};

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("if child components mount", () => {
    const wrapper = shallowMountApp();

    expect(wrapper.find(BaseCard).exists()).toBe(true);
    expect(wrapper.find(DashboardSettings).exists()).toBe(true);
  });

  test("inital default data is clean", () => {
    const { vm } = shallowMountApp();

    expect(vm.dashboard.blockSize).toEqual([]);
    expect(vm.dashboard.tiles).toEqual([]);
    expect(vm.messages).toEqual([]);
    expect(vm.deviceList).toEqual([]);
    expect(vm.simulating).toEqual(process.env.SIMULATING);
  });
});

const configuration = {};

function shallowMountApp() {
  return shallowMount(App, configuration);
}
