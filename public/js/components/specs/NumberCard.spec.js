import { shallowMount } from "@vue/test-utils";
import NumberCard from "../NumberCard";
import axe from "axe-core";

describe("NumberCard", () => {
  test("component can mount", () => {
    const wrapper = shallowMountNumberCard();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("renders with color and number value", () => {
    const wrapper = shallowMountNumberCard();

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("the messages watch method", () => {
    const spy = jest.spyOn(NumberCard.watch, "messages");
    const wrapper = shallowMount(NumberCard, {
      propsData: {
        messages: []
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

  test("verify component is accessible", () => {
    const wrapper = shallowMountNumberCard();

    axe.run(wrapper, (err, { violations }) => {
      expect(err).toBe(null);
      expect(violations).toHaveLength(0);
      done();
    });
  });
});

const mountingConfiguration = {
  propsData: {
    tile: {
      textColor: "blue"
    }
  },
  data: () => ({
    number: 1
  })
};

function shallowMountNumberCard() {
  return shallowMount(NumberCard, mountingConfiguration);
}
