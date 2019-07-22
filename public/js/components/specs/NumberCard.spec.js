import axe from "axe-core";
import { shallowMount } from "@vue/test-utils";

import NumberCard from "../NumberCard";

function shallowMountComponent(props = {}) {
  return shallowMount(NumberCard, {
    propsData: {
      tile: {
        textColor: "blue"
      },
      ...props
    },

    data: () => ({
      number: 1
    })
  });
}

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
