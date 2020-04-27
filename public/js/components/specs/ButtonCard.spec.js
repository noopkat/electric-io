import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import ButtonCard from "../ButtonCard";

function shallowMountComponent() {
  return shallowMount(ButtonCard, {
    propsData: {
      tile: {
        buttonText: "button-action",
        callType: "method",
        deviceId: "AZ3166",
        deviceMethod: "stop",
        id: "ac57912f-1a04-4cc2-a587-1bc116e8cc54",
        lineColor: "#FF6384",
        position: [200, 246],
        property: "",
        size: [2, 1.5],
        title: "Line Chart",
        type: "line-chart"
      },
      ariaLabel: "Init Card Creation"
    },
    data: () => ({
      apiUrlBase: "/api/device/AZ3166",
      statusText: "",
      statusClass: ""
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
    expect(wrapper.vm.statusClass).toEqual("");
  });

  test("the onClick method with successful response", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true
      })
    );

    const wrapper = shallowMountComponent();
    const spy = jest.spyOn(global, "fetch");
    const response = `${wrapper.vm.apiUrlBase}/method/${wrapper.vm.tile.deviceMethod},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }`;

    const button = wrapper.find("button");

    button.trigger("click");

    expect(wrapper.vm.statusText).toEqual("calling device method...");

    await response;

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
    expect(wrapper.vm.statusText).toEqual("done!");
    expect(wrapper.vm.statusClass).toEqual("success");
  });

  test("the onClick method's logic when the request fails", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false
      })
    );

    const wrapper = shallowMountComponent();
    const spy = jest.spyOn(global, "fetch");
    const response = `${wrapper.vm.apiUrlBase}/method/${wrapper.vm.tile.deviceMethod},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }`;

    const button = wrapper.find("button");

    button.trigger("click");

    expect(wrapper.vm.statusText).toEqual("calling device method...");

    await response;

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.statusText).toEqual(
      "oops, that device method might not exist!"
    );
    expect(wrapper.vm.statusClass).toEqual("error");
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
