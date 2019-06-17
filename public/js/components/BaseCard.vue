<template>
  <div
    class="card"
    tabindex="0"
    :class="{ dragging: draggingWithMouse }"
    :style="style"
    @mousedown.stop="onMouseDown"
    @keydown="moveCard"
  >
    <div v-if="showChildCard">
      <div v-if="showControls" class="controls">
        <button
          class="inline-button edit-button"
          ref="editButton"
          @click="onEdit"
        >
          edit
        </button>

        <button
          class="inline-button delete-button"
          aria-label="Remove card"
          @click="openCardDeleteModal()"
        >
          X
        </button>
      </div>

      <h2 v-if="tile.title">{{ tile.title }}</h2>

      <component
        :is="childCard"
        :tile="tile"
        :blockSize="blockSize"
        :messages="messages"
      ></component>
    </div>

    <card-form
      v-if="showForm"
      :editing="editing"
      :tile="tile"
      :deviceList="deviceList"
      :cardType="childCard"
      @save-settings="onSaveSettings"
    ></card-form>

    <a11y-dialog
      id="app-dialog"
      app-root="#app"
      dialog-root="#dialog-root"
      :class-names="{
        base: 'modal',
        title: 'modal__title',
        closeButton: 'inline-button modal__close-button'
      }"
      @dialog-ref="assignDialogRef"
      close-button-label="Close the “Remove card” dialog"
    >
      <template v-slot:title>
        <span>Remove card</span>
      </template>

      <template v-slot:closeButtonContent>
        <span>X</span>
      </template>

      <div>
        <p>Oh, do you really want to remove this card?</p>

        <button
          class="button action-button"
          type="button"
          @click="deleteTile(tile.id)"
        >
          Yes, remove it
        </button>
      </div>
    </a11y-dialog>
  </div>
</template>

<script>
import ButtonCard from "./ButtonCard";
import CardForm from "./CardForm";
import LineChartCard from "./LineChartCard";
import NumberCard from "./NumberCard";
import StickerCard from "./StickerCard";
import TextCard from "./TextCard";

export default {
  name: "base-card",
  props: ["tile", "blockSize", "deviceList", "messages", "editMode"],
  components: {
    ButtonCard,
    CardForm,
    LineChartCard,
    NumberCard,
    StickerCard,
    TextCard
  },

  data() {
    return {
      editing: false,
      draggingWithMouse: false,
      mouseMoved: false,
      y: this.tile.position[1],
      x: this.tile.position[0],
      offsetY: 0,
      offsetX: 0,
      dialog: null
    };
  },

  methods: {
    assignDialogRef(dialog) {
      this.dialog = dialog;
    },

    onMouseDown(event) {
      const allowedModes = ["unlocked", "demo"];
      const excludedNodes = ["INPUT", "TEXTAREA", "SELECT", "LABEL"];
      if (
        !this.draggingWithMouse &&
        !excludedNodes.includes(event.target.tagName) &&
        allowedModes.includes(this.editMode)
      ) {
        this.draggingWithMouse = true;
        this.offsetY = event.clientY - this.y;
        this.offsetX = event.clientX - this.x;
        window.addEventListener("mousemove", this.onMouseMove, true);
      }
    },

    onMouseMove(event) {
      this.mouseMoved = true;
      this.y = event.clientY - this.offsetY;
      this.x = event.clientX - this.offsetX;
    },

    onMouseUp(event) {
      window.removeEventListener("mousemove", this.onMouseMove, true);
      if (this.draggingWithMouse && this.mouseMoved) {
        const newPosition = { position: [this.x, this.y] };
        const eventData = Object.assign({}, this.tile, newPosition);

        this.$emit("tile-position", eventData);
      }
      this.draggingWithMouse = false;
      this.mouseMoved = false;
    },

    onEdit() {
      this.editing = true;
    },

    openCardDeleteModal() {
      if (this.dialog) {
        this.dialog.show();
      }
    },

    deleteTile(tileId) {
      this.$emit("tile-delete", tileId);
    },

    onSaveSettings(event) {
      this.editing = false;
      // focus on edit button
      this.$nextTick(function() {
        this.$refs.editButton.focus();
      });
      this.$emit("tile-settings", event);
    },

    moveCard(event) {
      // We should bail out early if
      // - the card doesn’t have focus
      // - the pressed key is not an arrow key
      if (
        document.activeElement !== this.$el ||
        !["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      const direction = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1;
      const axis = ["ArrowLeft", "ArrowRight"].includes(event.key) ? "x" : "y";
      const step = event.shiftKey ? 10 : 1;
      this[axis] += direction * step;
    }
  },

  computed: {
    top() {
      return `${this.y}px`;
    },

    left() {
      return `${this.x}px`;
    },

    style() {
      return {
        top: this.top,
        left: this.left,
        width: `${this.blockSize[0] * this.tile.size[0]}px`,
        minHeight: `${this.blockSize[1] * this.tile.size[1]}px`
      };
    },

    childCard() {
      return `${this.tile.type.toLowerCase()}-card`;
    },

    showChildCard() {
      return !this.editing;
    },

    showForm() {
      return this.editing;
    },

    showControls() {
      const allowedModes = ["unlocked", "demo"];
      return allowedModes.includes(this.editMode);
    }
  },

  mounted() {
    window.addEventListener("mouseup", this.onMouseUp, false);
  }
};
</script>
