import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import NumberCard from "../NumberCard";

function shallowMountComponent(props = {}) {
  return shallowMount(NumberCard, {
    propsData: {
      tile: {
        id: "ac57912f-1a14-4cc2-a587-1bc116e8cc54",
        position: [930, 417],
        property: "",
        size: [0.98, 0.73],
        textColor: "blue",
        title: "Number",
        type: "number"
      },
      ...props
    },

    data: () => ({
      number: 1
    })
  });
}

expect.extend(toHaveNoViolations);

describe("NumberCard", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("renders with color and number value", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("the messages watch method", () => {
    const spy = jest.spyOn(NumberCard.watch, "messages");
    const wrapper = shallowMountComponent({
      messages: []
    });

    expect(spy).toHaveBeenCalledTimes(0);

    wrapper.setProps({
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
    });

    expect(spy).toHaveBeenCalled();
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
