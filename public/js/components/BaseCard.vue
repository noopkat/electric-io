<template>
  <div
    class="card"
    tabindex="0"
    :class="{
      'card--is-being-dragged': isDraggingCard,
      'card--is-being-edited': editingCard
    }"
    :style="style"
    @mousedown.stop.passive="startDraggingCardWithMouse"
    @touchstart.stop.passive="startDraggingCardWithTouch"
    @keydown="moveCardWithArrows"
  >
    <card-form
      v-if="editingCard"
      :tile="tile"
      :device-list="deviceList"
      @save-settings="onSaveSettings"
      @cancel-editing="editingCard = false"
    />

    <template v-else>
      <div class="card-header">
        <h2 class="card-header__title">
          <template v-if="tile.title">
            {{ tile.title }}
          </template>

          <span v-else class="sr-only">
            Card
          </span>
        </h2>

        <div v-if="showCardActions" class="card-header__actions">
          <button
            ref="editButton"
            class="card__action-button icon-button"
            type="button"
            data-test="card-edit-button"
            @click="editingCard = true"
          >
            <span class="sr-only">Edit card</span>

            <span class="emoji-font flip-horizontally" aria-hidden="true"
              >✏</span
            >
          </button>

          <button
            class="card__action-button icon-button"
            type="button"
            data-test="card-remove-button"
            @click="openCardRemoveModal"
          >
            <span class="sr-only">Remove card</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="m2,0l4,4 4,-4 2,2 -4,4 4,4 -2,2 -4,-4 -4,4 -2,-2 4,-4 -4,-4 Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <component
        :is="cardComponentName"
        :tile="tile"
        :block-width="blockWidth"
        :block-height="blockHeight"
        :messages="messages"
      />
    </template>

    <a11y-dialog
      :id="`app-dialog-${tile.id}`"
      app-root="#app"
      dialog-root="#dialog-root"
      :class-names="{
        base: 'modal',
        title: 'modal__title',
        closeButton: 'modal__close-button icon-button'
      }"
      @dialog-ref="assignDialogRef"
    >
      <template v-slot:closeButtonContent>
        <span class="sr-only">Close the "Remove card" dialog</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="m2,0l4,4 4,-4 2,2 -4,4 4,4 -2,2 -4,-4 -4,4 -2,-2 4,-4 -4,-4 Z"
            fill="currentColor"
          />
        </svg>
      </template>

      <template v-slot:title>
        <span>Remove card</span>
      </template>

      <p>Do you want to remove this card?</p>

      <button
        class="thick-button"
        type="button"
        data-test="card-remove-confirm-button"
        @click="deleteTile(tile.id)"
      >
        Yes, remove it
      </button>
    </a11y-dialog>
  </div>
</template>

<script>
import ButtonCard from "./ButtonCard.vue";
import CardForm from "./CardForm.vue";
import LineChartCard from "./LineChartCard.vue";
import NumberCard from "./NumberCard.vue";
import StickerCard from "./StickerCard.vue";
import TextCard from "./TextCard.vue";

/**
 * A list of tag names whose elements will, when clicked, not cause a card being dragged around.
 */
const EXCLUDED_TAG_NAMES = [
  "BUTTON",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "LABEL",
  "IMG",
  "A"
];

const ALLOWED_MODES = ["unlocked", "demo"];

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
      default: () => ({}),
      validator(tile) {
        return ["id", "position", "size", "title", "type"].every(prop => {
          return tile.hasOwnProperty(prop);
        });
      }
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
      default: () => [],
      validator(deviceList) {
        return deviceList.every(deviceId => typeof deviceId === "string");
      }
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
      isDraggingCard: false,

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
        minHeight: `${this.blockHeight * this.tile.size[1]}px`,
        "--card-tile-width": `${this.blockWidth * this.tile.size[0]}px`
      };
    },

    cardComponentName() {
      return `${this.tile.type.toLowerCase()}-card`;
    },

    showCardActions() {
      return ALLOWED_MODES.includes(this.editMode);
    }
  },

  watch: {
    isDraggingCard(isDraggingCard) {
      if (isDraggingCard) {
        document.body.classList.add("is-being-dragged");
      } else if (document.body.classList.contains("is-being-dragged")) {
        document.body.classList.remove("is-being-dragged");
      }
    }
  },

  created() {
    this.breakPoint = 768;

    // It’s necessary that this event handler is registered on the window rather than the card
    // itself. If it’s registered on the card, a fast movement of the mouse can escape the card
    // quicker than what causes to the card to be re-rendered at the new position. This leads to
    // the mouse no longer being “above” the card; thus, no new mousemove events will be triggered.
    document.addEventListener("mousemove", this.dragCardWithMouse, {
      capture: true
    });

    // Touch-based event listeners are passive by default, but we actually need to call
    // event.preventDefault() so we need to explicitly mark them as active.
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
      const isLargerScreen = window.matchMedia(
        `(min-width: ${this.breakPoint}px)`
      ).matches;

      if (
        !isLargerScreen ||
        this.editingCard ||
        !ALLOWED_MODES.includes(this.editMode)
      ) {
        return;
      }

      if (this.isExcludedElementInDispatchChain(event.target, this.$el)) {
        return;
      }

      this.isDraggingCard = true;
      this.offsetY = clientY - this.y;
      this.offsetX = clientX - this.x;
    },

    /**
     * Used to detect when we *don’t* want to drag a card around
     * (e.g. when clicking in a button or draggin and image).
     *
     * @param {EventTarget} eventTarget
     * @param {Element} anchorElement
     * @returns {boolean}
     */
    isExcludedElementInDispatchChain(eventTarget, anchorElement) {
      const dispatchChainElements = getDispatchChainElements(
        eventTarget,
        anchorElement
      );
      return dispatchChainElements.some(element =>
        EXCLUDED_TAG_NAMES.includes(element.tagName)
      );
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
      if (!this.isDraggingCard || this.editingCard) {
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
      if (!this.isDraggingCard) {
        return;
      }

      this.isDraggingCard = false;

      if (this.cardHasBeenMoved) {
        this.emitCardPosition();
      }
    },

    openCardRemoveModal() {
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

/**
 * Returns all elements (at most 10) in a dispatch chain of an event up to a given anchor element.
 *
 * @param {EventTarget} eventTarget
 * @param {Element} anchorElement
 * @returns {Element[]}
 */
function getDispatchChainElements(eventTarget, anchorElement) {
  const dispatchChainElements = [];
  let currentElement = eventTarget;

  while (
    currentElement &&
    currentElement !== anchorElement &&
    dispatchChainElements.length < 10
  ) {
    dispatchChainElements.push(currentElement);
    currentElement = currentElement.parentElement;
  }

  return dispatchChainElements;
}
</script>

<style>
.card {
  --card-border-radius: 6px;
  --card-border-width: 2px;
  --card-form-width: 340px;

  width: var(--card-tile-width);
  padding: 15px;
  border: var(--card-border-width) solid #222;
  border-radius: var(--card-border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}

@media (max-width: 767px) {
  .card:not(:last-child) {
    margin-bottom: 15px;
  }
}

@media (min-width: 768px) {
  .card {
    position: absolute;
  }

  .card--is-being-dragged:hover {
    cursor: move;
    user-select: none;
  }

  .card:not(.card--is-being-edited):not(.settings) {
    cursor: grab;
  }
}

.card--is-being-edited {
  width: auto !important;
  min-width: var(--card-tile-width);
  z-index: 1;
}

.card:focus {
  outline: none;
}

.card:focus::before {
  --focus-offset: calc(-2 * var(--card-border-width));

  content: "";
  position: absolute;
  top: var(--focus-offset);
  left: var(--focus-offset);
  right: var(--focus-offset);
  bottom: var(--focus-offset);
  border: var(--card-border-width) dotted var(--background-color);
  border-radius: var(--card-border-radius);
  filter: invert(100%);
  pointer-events: none;
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.card-header__title {
  flex-grow: 1;
  margin-bottom: 0;
}

.card-header__actions {
  display: inline-flex;
  align-items: center;
}

.card-header__actions > :not(:first-child) {
  margin-left: 2px;
}

.flip-horizontally {
  transform: scaleX(-1);
}
</style>
