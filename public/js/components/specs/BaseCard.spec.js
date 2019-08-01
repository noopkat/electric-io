import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import BaseCard from "../BaseCard";

function shallowMountComponent() {
  return shallowMount(BaseCard, {
    stubs: {
      "a11y-dialog": true
    },
    propsData: {
      tile: {
        deviceId: "AZ3166",
        deviceMethod: "stop",
        id: "ac57912f-1a04-4cc2-a587-1bc116e8cc54",
        lineColor: "#FF6384",
        position: [200, 246],
        property: "",
        size: [2, 1.5],
        title: "Line Chart",
        type: "line-chart",
        callType: "method"
      },
      blockSize: [200, 250],
      deviceList: ["AZ3166", "Tessel2", "Jenn"],
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
      ],
      editMode: "unlocked"
    },
    data: () => ({
      editingCard: false,
      draggingCard: false,
      cardHasBeenMoved: false,
      x: 200,
      y: 246,
      offSetX: 0,
      offSetY: 0,
      dialog: null
    })
  });
}

expect.extend(toHaveNoViolations);

describe("BaseCard", () => {
  test("component can mount", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("the initial state of the default data", () => {
    const { vm } = shallowMountComponent();

    expect(vm.editingCard).toEqual(false);
    expect(vm.draggingCard).toEqual(false);
    expect(vm.cardHasBeenMoved).toEqual(false);
    expect(vm.x).toEqual(200);
    expect(vm.y).toEqual(246);
    expect(vm.offSetX).toEqual(0);
    expect(vm.offSetY).toEqual(0);
    expect(vm.dialog).toEqual(null);
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
