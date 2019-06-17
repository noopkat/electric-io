import { shallowMount } from "@vue/test-utils";
import LineChartCard from "../LineChartCard";
import chartOptions from "./../../lib/chartOptions";
import Chart from "chart.js";

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowMountLineChartCard();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the new Chart creation in the mounted lifecycle hook", () => {
    jest.spyOn(Chart, "Chart");
    const { vm } = shallowMountLineChartCard();

    expect(Chart.Chart).toHaveBeenCalled();
  });
});

function shallowMountLineChartCard() {
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
    },
    data: () => ({
      ctx: "AZ3166",
      chart: null,
      chartOptions,
      chartData: {
        datasets: [
          {
            label: "",
            data: [],
            fill: false,
            borderColor: "#000",
            borderWidth: 3,
            pointBorderWidth: 2,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#000",
            lineTension: 0
          }
        ]
      }
    })
  });
}
