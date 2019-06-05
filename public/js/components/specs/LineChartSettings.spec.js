import { mount, shallowMount } from "@vue/test-utils";
import LineChartSettings from "../LineChartSettings";

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowMountLineChartSettings();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});

function shallowMountLineChartSettings() {
  return mount(LineChartSettings, {
    propsData: {
      tile: {
        deviceId: "AZ3166",
        id: "ac57912f-1a04-4cc2-a587-1bc116e8cc54",
        lineColor: "#FF6384",
        position: [200, 246],
        property: "",
        size: [2, 1.5],
        title: "Line Chart",
        type: "line-chart"
      }
    }
  });
}
