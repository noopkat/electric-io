<template>
  <div class="cardForm">
    <h2>Settings</h2>

    <form @submit.prevent="onSubmit">
      <input name="id" type="hidden" :value="tile.id" />

      <label>
        Title
        <input
          ref="firstFocusableElement"
          type="text"
          name="title"
          :value="tile.title"
        />
      </label>

      <form-fields :tile="tile" :device-list="deviceList" />

      <input class="action-button" type="submit" value="save" />

      <input
        class="action-button action-button--secondary"
        type="button"
        value="cancel"
        @click="cancelEditing"
      />
    </form>
  </div>
</template>

<script>
import FormFields from "./FormFields";
import { Script } from "vm";

export default {
  name: "CardForm",

  components: { FormFields },

  props: {
    tile: {
      type: Object,
      required: true
    },
    deviceList: {
      type: Array,
      required: true
    }
  },

  mounted() {
    // After clicking the edit button, we need to focus the first focusable element in the form to
    // make sure editing a card is keyboard-accessible.
    this.$nextTick(function() {
      this.$refs.firstFocusableElement.focus();
    });
  },

  methods: {
    onSubmit(event) {
      let eventData = {};
      const formData = new FormData(event.target);
      formData.forEach((value, name) => {
        eventData[name] = value;
      });
      this.$emit("save-settings", eventData);
    },

    cancelEditing() {
      this.$emit("cancel-editing");
    }
  }
};
</script>
