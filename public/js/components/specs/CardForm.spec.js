import { shallowMount } from "@vue/test-utils";
import CardForm from "../CardForm";

describe("CardFrom", () => {
  test("component can mount", () => {
    const wrapper = shallowMountCardForm();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the new FormData", () => {
    const wrapper = shallowMountCardForm();
    const formData = document.querySelector(".cardForm form");
    wrapper.setProps({ editing: true });

    const event = {
      target: formData
    };

    wrapper.vm.onSubmit(event);

    expect(wrapper.emitted("save-settings")).toBeTruthy();
  });
});

function shallowMountCardForm() {
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
      deviceList: ["AZ3166", "Tessel2", "Jenn"]
    },
    attachToDocument: true
  });
}
