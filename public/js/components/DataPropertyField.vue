<template>
  <label
    :for="`data-property-input-${tileId}`"
    class="label"
    :class="{ 'label--invalid': !isValid }"
  >
    Data Property (supports

    <a href="http://jmespath.org/tutorial.html" target="_blank" rel="noopener"
      >JMESPath</a
    >)

    <input
      :id="`data-property-input-${tileId}`"
      v-model="model"
      type="text"
      :name="name"
      :aria-invalid="!isValid"
      data-test="data-prop-input"
    />

    <span
      v-if="!isValid"
      class="label__secondary"
      data-test="data-prop-secondary-label"
    >
      This is not a valid JMESPath.
    </span>
  </label>
</template>

<script>
import { pathIsValid } from "../lib/messagePropertyEvaluation.js";

export default {
  name: "DataPropertyField",

  props: {
    tileId: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      model: ""
    };
  },

  computed: {
    isValid() {
      return pathIsValid(this.model);
    }
  },

  created() {
    this.model = this.value;
  }
};
</script>

<style scoped>
.label--invalid input {
  border-color: var(--invalid-color);
}

.label--invalid .label__secondary {
  color: var(--invalid-color);
}
</style>
