<template>
  <label v-bind:for="inputElementId" v-bind:class="{ invalid: !isValid }">
    Data Property (supports
    <a href="http://jmespath.org/tutorial.html" target="_blank" rel="noopener"
      >JMESPath</a
    >)
    <input
      type="text"
      v-bind:id="inputElementId"
      v-bind:name="name"
      v-model="model"
      v-bind:aria-invalid="!isValid"
      v-bind:aria-describedby="!isValid ? errorElementId : null"
    />
    <span v-bind:id="errorElementId" v-if="!isValid"
      >This is not a valid JMESPath.</span
    >
  </label>
</template>

<script>
import { pathIsValid } from "../lib/messagePropertyEvaluation.js";

export default {
  name: "data-property-field",
  props: ["tileId", "name", "value"],
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
    },
    inputElementId: function() {
      return `data-property-input-${this.tileId}`;
    },
    errorElementId: function() {
      return `data-property-error-${this.tileId}`;
    }
  }
};
</script>
