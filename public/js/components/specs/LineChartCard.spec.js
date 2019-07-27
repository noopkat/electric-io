import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";
import Chartist from "chartist";

import LineChartCard from "../LineChartCard";

function shallowMountComponent(props = {}) {
  return shallowMount(LineChartCard, {
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
      blockSize: [200, 250],
      messages: [
        {
          deviceId: "BU2802",
          enqueuedTime: "2019-06-03T11:45:10.125Z",
          humidity: 32.800208338,
          temperature: 45.13494407
        },
        {
          deviceId: "AZ3166",
          enqueuedTime: "2019-06-03T11:33:10.125Z",
          humidity: 7.053375767532866,
          temperature: 31.599309710235097
        }
      ],
      ...props
    }
  });
}

jest.mock("chartist");
expect.extend(toHaveNoViolations);

describe("LineChartCard", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("new Chartist is called in mounted lifecycle hook", () => {
    const { vm } = shallowMountComponent();
    vm.chart.update = jest.fn();

    expect(Chartist.Line).toHaveBeenCalled();
  });

  test("computes the chartStyle width and height object and object property values", () => {
    const { vm } = shallowMountComponent();

    // Test the object returned in the computed method
    expect(vm.chartStyle).toEqual(
      expect.objectContaining({
        width: expect.any(String),
        height: expect.any(String)
      })
    );

    // Test the calcuation based upon the mock propsData
    expect(vm.chartStyle).toEqual({
      "--stroke-color": "#FF6384",
      height: "305px",
      width: "370px"
    });
  });

  test("the update of messages data based upon the watcher", () => {
    const spy = jest.spyOn(LineChartCard.watch, "messages");
    const wrapper = shallowMountComponent({
      messages: [],
      blockSize: [200, 250],
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
    });

    expect(spy).toHaveBeenCalledTimes(0);

    wrapper.setProps({
      messages: [
        {
          deviceId: "BU2802",
          enqueuedTime: "2019-06-03T11:45:10.125Z",
          humidity: 32.800208338,
          temperature: 45.13494407
        }
      ]
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
