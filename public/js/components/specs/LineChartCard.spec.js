import { shallowMount } from "@vue/test-utils";
import LineChartCard from "../LineChartCard";
import Chart from "chart.js";

jest.mock("chart.js");

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowmountLineChartCard();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("new Chart is called in mounted lifecycle hook", () => {
    const { vm } = shallowmountLineChartCard();
    vm.chart.update = jest.fn();

    expect(Chart).toHaveBeenCalled();
  });

  test("computes the CanvasStyle width and height object and object property values", () => {
    const { vm } = shallowmountLineChartCard();

    // Test the object returned in the computed method
    expect(vm.canvasStyle).toEqual(
      expect.objectContaining({
        width: expect.any(String),
        height: expect.any(String)
      })
    );

    // Test the calcuation based upon the mock propsData
    expect(vm.canvasStyle).toEqual({
      height: "305px",
      width: "370px"
    });
  });

  test("messages watcher", () => {
    const spy = jest.spyOn(LineChartCard.watch, "messages");
    const wrapper = shallowMount(LineChartCard, {
      propsData: {
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
      }
    });
    let Date = jest.fn();

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
    expect(Date).toHaveBeenCalled();
  });
});

function shallowmountLineChartCard() {
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
      ]
    }
  });
}
