<template>
  <div
    class="card"
    v-bind:class="{ dragging: dragging }"
    v-bind:style="style"
    v-on:mousedown.stop="onMouseDown"
  >
    <div v-if="showChildCard">
      <div v-if="showControls" class="controls">
        <button
          class="inline-button edit-button"
          ref="editButton"
          v-on:click="onEdit"
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
        v-bind:is="childCard"
        v-bind:tile="tile"
        v-bind:blockSize="blockSize"
        v-bind:messages="messages"
      >
      </component>
    </div>

    <card-form
      v-if="showForm"
      v-bind:editing="editing"
      v-bind:tile="tile"
      v-bind:deviceList="deviceList"
      v-bind:cardType="childCard"
      v-on:save-settings="onSaveSettings"
    >
    </card-form>

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
      dragging: false,
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

    onMouseDown: function(event) {
      const allowedModes = ["unlocked", "demo"];
      const excludedNodes = ["INPUT", "TEXTAREA", "SELECT", "LABEL"];
      if (
        !this.dragging &&
        !excludedNodes.includes(event.target.tagName) &&
        allowedModes.includes(this.editMode)
      ) {
        this.dragging = true;
        this.offsetY = event.clientY - this.y;
        this.offsetX = event.clientX - this.x;
        window.addEventListener("mousemove", this.onMouseMove, true);
      }
    },
    onMouseMove: function(event) {
      this.mouseMoved = true;
      this.y = event.clientY - this.offsetY;
      this.x = event.clientX - this.offsetX;
    },
    onMouseUp: function(event) {
      window.removeEventListener("mousemove", this.onMouseMove, true);
      if (this.dragging && this.mouseMoved) {
        const newPosition = { position: [this.x, this.y] };
        const eventData = Object.assign({}, this.tile, newPosition);

        this.$emit("tile-position", eventData);
      }
      this.dragging = false;
      this.mouseMoved = false;
    },
    onEdit: function() {
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
    onSaveSettings: function(event) {
      this.editing = false;
      // focus on edit button
      this.$nextTick(function() {
        this.$refs.editButton.focus();
      });
      this.$emit("tile-settings", event);
    }
  },
  computed: {
    top: function() {
      return `${this.y}px`;
    },
    left: function() {
      return `${this.x}px`;
    },
    style: function() {
      return {
        top: this.top,
        left: this.left,
        width: `${this.blockSize[0] * this.tile.size[0]}px`,
        minHeight: `${this.blockSize[1] * this.tile.size[1]}px`
      };
    },
    childCard: function() {
      return `${this.tile.type.toLowerCase()}-card`;
    },
    showChildCard: function() {
      return !this.editing;
    },
    showForm: function() {
      return this.editing;
    },
    showControls: function() {
      const allowedModes = ["unlocked", "demo"];
      return allowedModes.includes(this.editMode);
    }
  },
  mounted() {
    window.addEventListener("mouseup", this.onMouseUp, false);
  }
};
</script>
