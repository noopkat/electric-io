import axe from "axe-core";
import { shallowMount } from "@vue/test-utils";

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
