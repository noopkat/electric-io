import axe from "axe-core";
import { shallowMount } from "@vue/test-utils";

import DataPropertyField from "../DataPropertyField";

function shallowMountComponent(props = {}) {
  return shallowMount(DataPropertyField, {
    propsData: {
      name: "property",
      value: "",
      tileId: "",
      ...props
    }
  });
}

describe("DataPropertyField", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent({
      name: "property",
      value: "",
      tileId: ""
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("has one input element with the expected name", () => {
    const wrapper = shallowMountComponent({
      name: "unusual-property",
      value: "",
      tileId: ""
    });

    const inputs = wrapper.findAll("input[name=unusual-property]");

    expect(inputs.exists()).toBe(true);
    expect(inputs.length).toEqual(1);
  });

  describe("given valid input", () => {
    const validValue = "this.is.a.valid.value";

    test("has aria-invalid attribute unset", () => {
      const wrapper = shallowMountComponent({
        name: "property",
        value: validValue,
        tileId: ""
      });

      const input = wrapper.find("input[name=property]");

      expect(input.attributes("aria-invalid")).toBeUndefined();
    });

    test("has aria-describedby attribute unset", () => {
      const wrapper = shallowMountComponent({
        name: "property",
        value: validValue,
        tileId: ""
      });

      const input = wrapper.find("input[name=property]");

      expect(input.attributes("aria-describedby")).toBeUndefined();
    });
  });

  describe("given invalid input", () => {
    const invalidValue = "this is not a valid value";

    test("has aria-invalid attribute set to 'true'", () => {
      const wrapper = shallowMountComponent({
        name: "property",
        value: invalidValue,
        tileId: ""
      });

      const input = wrapper.find("input[name=property]");

      expect(input.attributes("aria-invalid")).toEqual("true");
    });

    test("has aria-describedby attribute set to an element that exists in the component", () => {
      const wrapper = shallowMountComponent({
        name: "property",
        value: invalidValue,
        tileId: ""
      });

      const input = wrapper.find("input[name=property]");
      const attributeValue = input.attributes("aria-describedby");
      const describedByElements = wrapper.findAll(`#${attributeValue}`);

      expect(describedByElements.exists()).toBe(true);
      expect(describedByElements.length).toEqual(1);
    });
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
