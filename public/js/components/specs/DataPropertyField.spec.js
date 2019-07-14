import { shallowMount } from "@vue/test-utils";
import axe from "axe-core";
import DataPropertyField from "../DataPropertyField";

describe("DataPropertyField", () => {
  test("component can mount", () => {
    const wrapper = shallowMountDataPropertyField("property", "", "");

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("has one input element with the expected name", () => {
    const wrapper = shallowMountDataPropertyField("unusual-property", "", "");

    const inputs = wrapper.findAll("input[name=unusual-property]");

    expect(inputs.exists()).toBe(true);
    expect(inputs.length).toEqual(1);
  });

  describe("given valid input", () => {
    const validValue = "this.is.a.valid.value";

    test("has aria-invalid attribute unset", () => {
      const wrapper = shallowMountDataPropertyField("property", validValue, "");

      const input = wrapper.find("input[name=property]");

      expect(input.attributes("aria-invalid")).toBeUndefined();
    });

    test("has aria-describedby attribute unset", () => {
      const wrapper = shallowMountDataPropertyField("property", validValue, "");

      const input = wrapper.find("input[name=property]");

      expect(input.attributes("aria-describedby")).toBeUndefined();
    });
  });

  describe("given invalid input", () => {
    const invalidValue = "this is not a valid value";

    test("has aria-invalid attribute set to 'true'", () => {
      const wrapper = shallowMountDataPropertyField(
        "property",
        invalidValue,
        ""
      );

      const input = wrapper.find("input[name=property]");

      expect(input.attributes("aria-invalid")).toEqual("true");
    });

    test("has aria-describedby attribute set to an element that exists in the component", () => {
      const wrapper = shallowMountDataPropertyField(
        "property",
        invalidValue,
        ""
      );

      const input = wrapper.find("input[name=property]");
      const attributeValue = input.attributes("aria-describedby");
      const describedByElements = wrapper.findAll(`#${attributeValue}`);

      expect(describedByElements.exists()).toBe(true);
      expect(describedByElements.length).toEqual(1);
    });
  });

  test("verify component is accessible", () => {
    const wrapper = shallowMountDataPropertyField("property", "value", "");

    axe.run(wrapper, (err, { violations }) => {
      expect(err).toBe(null);
      expect(violations).toHaveLength(0);
      done();
    });
  });
});

function shallowMountDataPropertyField(name, value, tileId) {
  return shallowMount(DataPropertyField, {
    propsData: {
      name: name,
      value: value,
      tileId: tileId
    }
  });
}
