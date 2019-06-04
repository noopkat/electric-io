import { mount, shallowMount } from "@vue/test-utils";
import NumberCard from "../NumberCard";

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowMountNumberCard();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("renders with color and number value", () => {
    const wrapper = shallowMountNumberCard();

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("the messages watch method", () => {
    const spy = sinon.spy(NumberCard.watch, "messages");
    const wrapper = mount(NumberCard, {
      propsDat: {
        messages: []
      }
    });

    expect(spy.called).toBe(false);

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

    Vue.nextTick(() => {
      expect(spy.called).toBe(true);
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
