import { shallowMount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";

import BaseCard from "../BaseCard";

function shallowMountComponent() {
  return shallowMount(BaseCard, {
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
    stubs: {
      "a11y-dialog": true
    }
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
    expect(vm.x).toEqual(vm.tile.position[0]);
    expect(vm.y).toEqual(vm.tile.position[1]);
    expect(vm.offsetX).toEqual(0);
    expect(vm.offsetY).toEqual(0);
    expect(vm.dialog).toEqual(null);
  });

  test("the computed values of the top and left computed method", () => {
    const { vm } = shallowMountComponent();

    expect(vm.left).toEqual("200px");
    expect(vm.top).toEqual("246px");

    vm.x = 210;
    vm.y = 262;

    expect(vm.left).toEqual("210px");
    expect(vm.top).toEqual("262px");
  });

  test("the computed value of style", () => {
    const wrapper = shallowMountComponent();
    const inlineStyles = {
      top: wrapper.vm.top,
      left: wrapper.vm.left,
      "--card-tile-width": `${wrapper.vm.blockSize[0] *
        wrapper.vm.tile.size[0]}px`,
      minHeight: `${wrapper.vm.blockSize[1] * wrapper.vm.tile.size[1]}px`
    };

    expect(wrapper.vm.style).toEqual(inlineStyles);

    const card = wrapper.find(".card");

    expect(card.attributes().style).toBe(
      `top: ${inlineStyles.top}; left: ${inlineStyles.left}; min-height: ${inlineStyles.minHeight};`
    );
  });

  test("the computed value of childCard", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.childCard).toEqual("line-chart-card");

    wrapper.setProps({
      tile: {
        deviceId: "AZ3166",
        deviceMethod: "stop",
        id: "ac57912f-1a04-4cc2-a587-1bc116e8cc54",
        lineColor: "#FF6384",
        position: [200, 246],
        property: "",
        size: [2, 1.5],
        title: "Line Chart",
        type: "Button",
        callType: "method"
      }
    });

    expect(wrapper.vm.childCard).toEqual("button-card");
  });

  test("the computed value of showControlers", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.showControls).toEqual(true);

    wrapper.setProps({
      editMode: "locked"
    });

    expect(wrapper.vm.showControls).toEqual(false);
  });

  test("the draggingCard watcher", () => {
    const spy = jest.spyOn(BaseCard.watch, "draggingCard");
    const { vm } = shallowMountComponent();
    const event = {
      target: {
        tagName: "H2"
      }
    };

    vm.startDraggingCard(event);

    expect(spy).toHaveBeenCalled();
  });

  //   test("test if the custom event listeners are created after the component mounts", () => {
  //     const wrapper = shallowMountComponent();

  //     wrapper.find()
  //   });

  test("the assigndialogRef method", () => {
    const { vm } = shallowMountComponent();

    vm.assignDialogRef(dialog => {
      expect(vm.dialog).toEqual(dialog);
    });
  });

  test("the openCardDeleteModal method", () => {
    const spy = jest.spyOn(BaseCard.methods, "openCardDeleteModal");
    const wrapper = shallowMountComponent();

    const button = wrapper.find(".delete-button");

    button.trigger("click");

    expect(spy).toHaveBeenCalled();
  });

  test("onTileDelete method", () => {
    const wrapper = shallowMountComponent();
    const tileId = wrapper.vm.tile.id;

    const button = wrapper.find(".action-button");

    button.trigger("click");

    expect(wrapper.vm.$emit("tile-delete")).toBeTruthy();
  });

  test("the onSaveSettings method", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.editingCard).toEqual(false);

    const button = wrapper.find(".edit-button");

    button.trigger("click");

    expect(wrapper.vm.editingCard).toEqual(true);

    wrapper.find({ name: "CardForm" }).vm.$emit("save-settings", {
      bgColor: "#fff",
      bgImageRepeat: true,
      bgImageUrl: "",
      title: "\u2700 IoT Dashboard"
    });

    expect(wrapper.vm.$emit("save-settings")).toBeTruthy();
  });

  test("the updateCardPosition method", () => {
    const wrapper = shallowMountComponent();

    expect(wrapper.vm.x).toEqual(200);
    expect(wrapper.vm.y).toEqual(246);

    wrapper.vm.updateCardPosition({
      x: 253,
      y: 310
    });

    expect(wrapper.vm.x).toEqual(253);
    expect(wrapper.vm.y).toEqual(310);
  });

  test("if the updateCardPosition method is called in the dragCard method", () => {
    const spy = jest.spyOn(BaseCard.methods, "updateCardPosition");
    const { vm } = shallowMountComponent();

    const event = {
      preventDefault: jest.fn()
    };

    vm.dragCard(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(vm.cardHasBeenMoved).toEqual(false);
    expect(spy).not.toHaveBeenCalled();

    vm.draggingCard = true;
    vm.editingCard = false;

    vm.dragCard(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(vm.cardHasBeenMoved).toEqual(true);
    expect(spy).toHaveBeenCalled();
  });

  test("check and make sure the emitCardPosition method is called when stopDraggingCard or moveCardWithArrows are invoked", () => {
    const spy = jest.spyOn(BaseCard.methods, "emitCardPosition");
    const { vm } = shallowMountComponent();
    const event = {
      preventDefault: jest.fn(),
      key: "ArrowUp"
    };

    vm.editingCard = false;
    vm.$el = document.activeElement;

    vm.moveCardWithArrows(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();

    vm.stopDraggingCard();
    vm.cardHasBeenMoved = true;

    expect(vm.draggingCard).toEqual(false);
    expect(spy).toHaveBeenCalled();
  });

  test("Axe doesn’t find any violations", async () => {
    const wrapper = shallowMountComponent();
    const html = wrapper.html();

    expect(await axe(html)).toHaveNoViolations();
  });
});
