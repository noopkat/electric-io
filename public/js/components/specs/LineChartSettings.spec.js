import { shallowMount } from "@vue/test-utils";
import LineChartSettings from "../LineChartSettings";
import axe from "axe-core";

describe("LineChartSettings", () => {
  test("component can mount", () => {
    const wrapper = shallowMountLineChartSettings();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the deviceList prop is populated", () => {
    const { vm } = shallowMountLineChartSettings();

    expect(vm.deviceList.length).toBe(3);
  });

  test("that there are 3 labels in the LineChartSettings window", () => {
    const wrapper = shallowMountLineChartSettings();

    const labels = wrapper.findAll("label");

    expect(labels.exists()).toBe(true);
    expect(labels.length).toEqual(3);
  });
  test("verify component is accessible", () => {
    const wrapper = shallowMountLineChartSettings();

    axe.run(wrapper, (err, { violations }) => {
      expect(err).toBe(null);
      expect(violations).toHaveLength(0);
      done();
    });
  });
});

function shallowMountLineChartSettings() {
  return shallowMount(LineChartSettings, {
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
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    }
  });
}
