import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import FormFields from "../FormFields";

function shallowMountComponent() {
  return shallowMount(FormFields, {
    propsData: {
      tile: {
        type: "line-chart",
        callType: "method"
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    }
  });
}

expect.extend(toHaveNoViolations);

describe("FormFields", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("which component is rendered based upon the tile.type prop property", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.settingsCard).toEqual("line-chart-settings");

    wrapper.setProps({
      tile: {
        type: "button",
        callType: "method"
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    });

    expect(wrapper.vm.settingsCard).toEqual("button-settings");

    wrapper.setProps({
      tile: {
        type: "number",
        callType: "method"
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    });

    expect(wrapper.vm.settingsCard).toEqual("number-settings");

    wrapper.setProps({
      tile: {
        type: "sticker",
        callType: "method"
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    });

    expect(wrapper.vm.settingsCard).toEqual("sticker-settings");

    wrapper.setProps({
      tile: {
        type: "text",
        callType: "method"
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    });

    expect(wrapper.vm.settingsCard).toEqual("text-settings");
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
