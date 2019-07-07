<template>
  <div class="cardForm">
    <h2>Settings</h2>

    <form v-on:submit.prevent="onSubmit">
      <input name="id" type="hidden" v-bind:value="tile.id" />

      <label>
        Title
        <input
          type="text"
          name="title"
          v-bind:value="tile.title"
          ref="firstFocusableElement"
        />
      </label>

      <form-fields :tile="tile" :deviceList="deviceList" />

      <input class="action-button" type="submit" value="save" />
    </form>
  </div>
</template>

<script>
import FormFields from "./FormFields";
import { Script } from "vm";

export default {
  name: "card-form",
  components: { FormFields },
  props: ["tile", "deviceList", "editing"],
  mounted() {
    // After clicking the edit button, we need to focus the first focusable element in the form to
    // make sure editing a card is keyboard-accessible.
    this.$nextTick(function() {
      this.$refs.firstFocusableElement.focus();
    });
  },
  methods: {
    onSubmit: function(event) {
      let eventData = {};
      const formData = new FormData(event.target);
      formData.forEach((value, name) => {
        eventData[name] = value;
      });
      this.$emit("save-settings", eventData);
    }
  }
};
</script>
