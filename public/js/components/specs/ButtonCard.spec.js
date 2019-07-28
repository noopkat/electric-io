import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import ButtonCard from "../ButtonCard";

function shallowMountComponent() {
  return shallowMount(ButtonCard, {
    propsData: {
      tile: {
        deviceId: "AZ3166",
        deviceMethod: "stop",
        id: "ac57912f-1a04-4cc2-a587-1bc116e8cc54",
        lineColor: "#FF6384",
        position: [200, 246],
        property: "",
        size: [2, 1.5],
        title: "Line Chart",
        type: "line-chart",
        callType: "method"
      },
      ariaLabel: "Init Card Creation"
    },
    data: () => ({
      apiUrlBase: "/api/device/AZ3166",
      statusText: "",
      statusClass: "status"
    })
  });
}

expect.extend(toHaveNoViolations);

describe("ButtonCard", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the iniital state of the data object", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.apiUrlBase).toEqual(
      `/api/device/${wrapper.vm.tile.deviceId}`
    );
    expect(wrapper.vm.statusText).toEqual("");
    expect(wrapper.vm.statusClass).toEqual("status");
  });

  test("the onClick method", () => {
    const spy = jest.spyOn(global, "fetch");

    const wrapper = shallowMountComponent();
    const button = wrapper.find("button");

    button.trigger("click");

    expect(wrapper.vm.statusText).toEqual("calling device method...");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      `${wrapper.vm.apiUrlBase}/method/${wrapper.vm.tile.deviceMethod}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }
    );
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
