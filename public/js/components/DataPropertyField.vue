<template>
  <label :for="inputElementId" :class="{ invalid: !isValid }">
    Data Property (supports
    <a href="http://jmespath.org/tutorial.html" target="_blank" rel="noopener">
      JMESPath</a
    >)

    <input
      :id="inputElementId"
      v-model="model"
      type="text"
      :name="name"
      :aria-invalid="!isValid"
      :aria-describedby="!isValid ? errorElementId : null"
    />

    <span v-if="!isValid" :id="errorElementId">
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
    isValid: function() {
      return pathIsValid(this.model);
    },

    inputElementId: function() {
      return `data-property-input-${this.tileId}`;
    },

    errorElementId: function() {
      return `data-property-error-${this.tileId}`;
    }
  },

  mounted() {
    this.model = this.value;
  }
};
</script>
