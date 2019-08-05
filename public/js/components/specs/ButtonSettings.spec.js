import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import ButtonSettings from "../ButtonSettings";

function shallowMountComponent() {
  return shallowMount(ButtonSettings, {
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
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    }
  });
}

expect.extend(toHaveNoViolations);

describe("ButtonSettings", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the iniital state of the data object", () => {
    const defaultData = ButtonSettings.data();

    expect(defaultData).toEqual({
      typeOptions: [
        {
          text: "Direct Method",
          value: "method"
        },
        {
          text: "C2D Message",
          value: "message"
        }
      ]
    });
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
