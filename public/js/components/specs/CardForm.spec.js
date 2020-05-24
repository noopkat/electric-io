import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import CardForm from "../CardForm";

/**
 * Helper function for injecting a test element into the DOM
 * This element can then be used as the mount point when using the [`attachTo`][1] option.
 *
 * [1]: https://vue-test-utils.vuejs.org/api/options.html#attachto
 *
 * @returns {string} a CSS selector that should be used as the value for the `attachTo` option
 */
function injectTestDiv() {
  const id = "root";
  const div = document.createElement("div");
  div.id = id;
  document.body.appendChild(div);
  return `#${id}`;
}

function shallowMountComponent(props = {}) {
  return shallowMount(CardForm, {
    attachTo: injectTestDiv(),

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
    }
  });
}

expect.extend(toHaveNoViolations);

describe("CardFrom", () => {
  test("Component can be mounted", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.html()).toBeTruthy();
  });

  test("save-settings event is emitted", async () => {
    const wrapper = shallowMountComponent();
    const formData = document.querySelector(".card__form form");
    await wrapper.setProps({ editing: true });

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
