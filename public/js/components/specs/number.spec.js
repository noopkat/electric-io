import { shallowMount } from "@vue/test-utils";
import NumberCard from "../NumberCard";

describe("Number card", () => {
  test("component can mount", () => {
    const wrapper = shallowMount(NumberCard);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("renders with color and number value", () => {
    const wrapper = shallowMount(NumberCard, {
      propsData: {
        tile: {
          textColor: "blue"
        }
      },
      data: () => ({
        number: 1
      })
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
