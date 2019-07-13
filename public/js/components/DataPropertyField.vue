<template>
  <label v-bind:class="{ invalid: !isValid }">
    Data Property (supports
    <a href="http://jmespath.org/tutorial.html" target="_blank" rel="noopener"
      >JMESPath</a
    >)
    <input
      type="text"
      v-bind:name="name"
      v-model="model"
      v-bind:aria-invalid="!isValid"
    />
    <span v-if="!isValid">This is not a valid JMESPath.</span>
  </label>
</template>

<script>
import { pathIsValid } from "../lib/messagePropertyEvaluation.js";

export default {
  name: "data-property-field",
  props: ["name", "value"],
  data() {
    return {
      model: ""
    };
  },
  mounted() {
    this.model = this.value;
  },
  computed: {
    isValid: function() {
      return pathIsValid(this.model);
    }
  }
};
</script>
