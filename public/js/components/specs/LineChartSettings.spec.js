import axe from "axe-core";
import { shallowMount } from "@vue/test-utils";

import LineChartSettings from "../LineChartSettings";

function shallowMountComponent(props = {}) {
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
    },
    ...props
  });
}

describe("LineChartSettings", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the deviceList prop is populated", () => {
    const { vm } = shallowMountComponent();

    expect(vm.deviceList.length).toBe(3);
  });

  test("that there is a device ID field in the LineChartSettings window", () => {
    const wrapper = shallowMountComponent();

    const elements = wrapper.findAll("[name=deviceId]");

    expect(elements.exists()).toBe(true);
    expect(elements.length).toEqual(1);
  });

  test("that there is a data property field in the LineChartSettings window", () => {
    const wrapper = shallowMountComponent();

    const elements = wrapper.findAll("[name=property]");

    expect(elements.exists()).toBe(true);
    expect(elements.length).toEqual(1);
  });

  test("that there is a line color field in the LineChartSettings window", () => {
    const wrapper = shallowMountComponent();

    const elements = wrapper.findAll("[name=lineColor]");

    expect(elements.exists()).toBe(true);
    expect(elements.length).toEqual(1);
  });

  test("updateValue()", () => {
    const wrapper = shallowMountComponent();
    const spy = jest.spyOn(wrapper.vm, "updateValue");
    wrapper.vm.updateValue("#ff8800");
    expect(spy).toBeCalled();
  });

  /**
   * TODO:
   *
   * The Axe tests run and pass, but they don’t actually test the component in a properly mounted
   * state. Introducing a deliberate error (i.e. an unlabeled form control) don’t make them fail.
   *
   * Feel free to fix them. 👋
   */
  test.skip("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();

    const error = await axe.run(wrapper.vm.$el);
    expect(error).toBe(null);
  });
});
