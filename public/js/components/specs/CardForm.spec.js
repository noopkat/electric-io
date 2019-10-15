import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import CardForm from "../CardForm";

function shallowMountComponent(props = {}) {
  return shallowMount(CardForm, {
    propsData: {
      tile: {
        altText: "",
        id: "88e12934-c628-48cb-8b84-b16c2e311105",
        position: [183, 97],
        size: [1, 1],
        title: "New Title Change",
        type: "sticker",
        url: "https://media.giphy.com/media/1wXeLxuTVBZe0Ht7Zu/giphy.gif"
      },
      deviceList: ["AZ3166", "Tessel2", "Jenn"],
      ...props
    },
    attachToDocument: true
  });
}

expect.extend(toHaveNoViolations);

describe("CardFrom", () => {
  test("Component can be mounted", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("save-settings event is emitted", () => {
    const wrapper = shallowMountComponent();
    const formData = document.querySelector(".cardForm form");
    wrapper.setProps({ editing: true });

    const event = {
      target: formData
    };

    wrapper.vm.onSubmit(event);

    expect(wrapper.emitted("save-settings")).toBeTruthy();
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
