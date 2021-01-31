<template>
  <div class="card__form">
    <h2>Settings</h2>

    <form @submit.prevent="onSubmit">
      <input
        name="id"
        type="hidden"
        :value="tile.id"
      >

      <label for="title">
        Title
        <input
          ref="firstFocusableElement"
          type="text"
          name="title"
          :value="tile.title"
        >
      </label>

      <form-fields
        :tile="tile"
        :device-list="deviceList"
      />

      <button
        class="thick-button"
        type="submit"
      >
        save
      </button>

      <button
        class="thick-button thick-button--secondary"
        type="button"
        @click="cancelEditing"
      >
        cancel
      </button>
    </form>
  </div>
</template>

<script>
import FormFields from "./FormFields";

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

<style scoped>
.card__form form {
  padding: 0;
  background-color: #fff;
  max-width: var(--card-form-width);
}

.card__form .max-length-info {
  margin-top: -7px;
  margin-bottom: 15px;
  display: block;
}

.card__form .invalid {
  color: var(--invalid-color);
}
</style>
