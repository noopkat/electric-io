<template>
  <div
    class="card"
    tabindex="0"
    :class="{ dragging: draggingCard }"
    :style="style"
    @mousedown.stop.capture="startDraggingCard"
    @keydown="moveCardWithArrows"
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
          @click="openCardDeleteModal"
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
      draggingCard: false,
      mouseWasMovedWhileDragging: false,

      // The position of a card’s top-left corner relative to the dashboard
      x: this.tile.position[0],
      y: this.tile.position[1],

      // Offset of the mouse cursor relative to a card’s top-left corner.
      offsetX: 0,
      offsetY: 0,

      dialog: null
    };
  },

  watch: {
    draggingCard(dragging) {
      if (dragging) {
        document.body.classList.add("dragging");
      } else if (document.body.classList.contains("dragging")) {
        document.body.classList.remove("dragging");
      }
    }
  },

  methods: {
    assignDialogRef(dialog) {
      this.dialog = dialog;
    },

    startDraggingCard(event) {
      const allowedModes = ["unlocked", "demo"];
      const excludedNodes = ["INPUT", "TEXTAREA", "SELECT", "LABEL"];

      if (
        event.buttons !== 1 || // primary mouse button
        excludedNodes.includes(event.target.tagName) ||
        !allowedModes.includes(this.editMode)
      ) {
        return;
      }

      this.draggingCard = true;
      this.offsetY = event.clientY - this.y;
      this.offsetX = event.clientX - this.x;
    },

    dragCard(event) {
      event.stopPropagation();

      if (!this.draggingCard) {
        return;
      }

      this.mouseWasMovedWhileDragging = true;

      this.updateCardPosition({
        x: event.clientX - this.offsetX,
        y: event.clientY - this.offsetY
      });
    },

    stopDraggingCard(event) {
      if (!this.draggingCard || !this.mouseWasMovedWhileDragging) {
        return;
      }

      this.draggingCard = false;
      this.mouseWasMovedWhileDragging = false;

      this.emitCardPosition();
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

    /**
     * Event handler for moving the card with arrow keys.
     *
     * This function does nothing in the following cases:
     *
     * - The card is not focused
     * - The pressed key is not an arrow key
     *
     * @param {KeyboardEvent} event
     */
    moveCardWithArrows(event) {
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

      const newCardPosition = {};
      newCardPosition[axis] = this[axis] + direction * step;
      this.updateCardPosition(newCardPosition);
      this.emitCardPosition();
    },

    /**
     * Sets the card’s position and takes care of sanitizing its value.
     *
     * Currently, it makes sure that the card cannot be positioned outside the top-left corner of
     * the dashboard.
     */
    updateCardPosition({ x = this.x, y = this.y }) {
      this.x = Math.max(0, x);
      this.y = Math.max(0, y);
    },

    emitCardPosition() {
      const newPosition = { position: [this.x, this.y] };
      const eventData = Object.assign({}, this.tile, newPosition);

      this.$emit("tile-position", eventData);
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
    // It’s necessary that this event handler is registered on the window rather than the card
    // itself. If it’s registered on the card, a fast movement of the mouse can escape the card
    // quicker than what causes to the card to be re-rendered at the new position. This leads to
    // the mouse no longer being “above” the card; thus, no new mousemove events will be triggered.
    window.addEventListener("mousemove", this.dragCard, { capture: true });
    window.addEventListener("mouseup", this.stopDraggingCard);
  }
};
</script>
