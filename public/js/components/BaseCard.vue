<template>
  <div
    class="card"
    tabindex="0"
    :class="{
      'card--is-being-dragged': draggingCard,
      'card--is-being-edited': editingCard
    }"
    :style="style"
    @mousedown.stop.passive="startDraggingCardWithMouse"
    @touchstart.stop.passive="startDraggingCardWithTouch"
    @keydown="moveCardWithArrows"
  >
    <div v-if="!editingCard">
      <div v-if="showControls" class="controls">
        <button
          ref="editButton"
          class="inline-button edit-button"
          @click="editingCard = true"
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

      <h2 v-if="tile.title">
        {{ tile.title }}
      </h2>

      <component
        :is="childCard"
        :tile="tile"
        :block-width="blockWidth"
        :block-height="blockHeight"
        :messages="messages"
      />
    </div>

    <card-form
      v-if="editingCard"
      :editing="editingCard"
      :tile="tile"
      :device-list="deviceList"
      :card-type="childCard"
      @save-settings="onSaveSettings"
      @cancel-editing="editingCard = false"
    />

    <a11y-dialog
      :id="`app-dialog-${tile.id}`"
      app-root="#app"
      dialog-root="#dialog-root"
      :class-names="{
        base: 'modal',
        title: 'modal__title',
        closeButton: 'inline-button modal__close-button'
      }"
      close-button-label="Close the “Remove card” dialog"
      @dialog-ref="assignDialogRef"
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
  name: "BaseCard",

  components: {
    ButtonCard,
    CardForm,
    LineChartCard,
    NumberCard,
    StickerCard,
    TextCard
  },

  props: {
    tile: {
      type: Object,
      required: false,
      default: () => ({})
    },
    blockWidth: {
      type: Number,
      required: true
    },
    blockHeight: {
      type: Number,
      required: true
    },
    deviceList: {
      type: Array,
      required: false,
      default: () => []
    },
    messages: {
      type: Array,
      required: false,
      default: () => []
    },
    editMode: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      editingCard: false,

      // Used to attach an HTML class to the card.
      draggingCard: false,

      // Used to only emit card position changes when the card is being moved.
      cardHasBeenMoved: false,

      // The position of a card’s top-left corner relative to the dashboard.
      x: this.tile.position[0],
      y: this.tile.position[1],

      // Offset of the mouse cursor relative to a card’s top-left corner.
      offsetX: 0,
      offsetY: 0,

      // Will be set with `assignDialogRef`. Allows one to call methods like `this.dialog.show()`.
      dialog: null
    };
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
        "--card-tile-width": `${this.blockWidth * this.tile.size[0]}px`,
        minHeight: `${this.blockHeight * this.tile.size[1]}px`
      };
    },

    childCard() {
      return `${this.tile.type.toLowerCase()}-card`;
    },

    showControls() {
      const allowedModes = ["unlocked", "demo"];
      return allowedModes.includes(this.editMode);
    }
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

  mounted() {
    // It’s necessary that this event handler is registered on the window rather than the card
    // itself. If it’s registered on the card, a fast movement of the mouse can escape the card
    // quicker than what causes to the card to be re-rendered at the new position. This leads to
    // the mouse no longer being “above” the card; thus, no new mousemove events will be triggered.
    document.addEventListener("mousemove", this.dragCardWithMouse, {
      capture: true
    });

    // Touch-based event listeners are passive by default, but we actually need to call
    // event.preventDefault() so we need to explicitly make them active.
    document.addEventListener("touchmove", this.dragCardWithTouch, {
      capture: true,
      passive: false
    });
    document.addEventListener("mouseup", this.stopDraggingCard);
    document.addEventListener("touchend", this.stopDraggingCard);
  },

  methods: {
    /**
     * @param {HTMLElement} dialog
     */
    assignDialogRef(dialog) {
      this.dialog = dialog;
    },

    /**
     * @param {MouseEvent} event
     */
    startDraggingCardWithMouse(event) {
      // 1 in event.buttons represents the primary mouse button
      if (event.buttons === 1) {
        this.startDraggingCard(event, event.clientX, event.clientY);
      }
    },

    /**
     * @param {TouchEvent} event
     */
    startDraggingCardWithTouch(event) {
      this.startDraggingCard(
        event,
        event.touches[0].clientX,
        event.touches[0].clientY
      );
    },

    /**
     * @param {MouseEvent|TouchEvent} event
     */
    startDraggingCard(event, clientX, clientY) {
      const allowedModes = ["unlocked", "demo"];
      const excludedNodes = ["INPUT", "TEXTAREA", "SELECT", "LABEL"];

      if (
        this.editingCard ||
        excludedNodes.includes(event.target.tagName) ||
        !allowedModes.includes(this.editMode)
      ) {
        return;
      }

      this.draggingCard = true;
      this.offsetY = clientY - this.y;
      this.offsetX = clientX - this.x;
    },

    /**
     * @param {MouseEvent} event
     */
    dragCardWithMouse(event) {
      this.dragCard(event, event.clientX, event.clientY);
    },

    /**
     * @param {TouchEvent} event
     */
    dragCardWithTouch(event) {
      const clientX = event.touches[0].clientX;
      const clientY = event.touches[0].clientY;
      this.dragCard(event, clientX, clientY);
    },

    /**
     * @param {MouseEvent|TouchEvent} event
     */
    dragCard(event, clientX, clientY) {
      if (!this.draggingCard || this.editingCard) {
        return;
      }

      // Stop touch events from dragging the page.
      event.preventDefault();

      this.cardHasBeenMoved = true;

      this.updateCardPosition({
        x: clientX - this.offsetX,
        y: clientY - this.offsetY
      });
    },

    stopDraggingCard() {
      this.draggingCard = false;

      if (this.cardHasBeenMoved) {
        this.emitCardPosition();
      }
    },

    openCardDeleteModal() {
      if (this.dialog) {
        this.dialog.show();
      }
    },

    /**
     * @param {string} tileId
     */
    deleteTile(tileId) {
      this.$emit("tile-delete", tileId);
    },

    /**
     * @param {object} eventData
     */
    onSaveSettings(eventData) {
      this.editingCard = false;

      // Return focus to the edit button
      this.$nextTick(function() {
        this.$refs.editButton.focus();
      });

      this.$emit("tile-settings", eventData);
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
        this.editingCard ||
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
  }
};
</script>
