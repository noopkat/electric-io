<template>
  <p class="number" v-bind:style="numberStyle">{{ number }}</p>
</template>

<script>
import { evaluatePath } from "../lib/messagePropertyEvaluation.js";

export default {
  name: "number-card",
  props: {
    tile: {
      default: () => ({})
    },
    blockSize: {
      default: () => []
    },
    messages: {
      default: () => []
    }
  },
  data: function() {
    return {
      number: 0
    };
  },
  watch: {
    messages: function() {
      const lastMessage = this.messages.pop();
      if (lastMessage) {
        const value = evaluatePath(this.tile.property, lastMessage);
        this.number = value ? parseFloat(value).toFixed(1) : "";
      } else {
        this.number = 0;
      }
    }
  },
  computed: {
    numberStyle: function() {
      return { color: this.tile.textColor };
    }
  }
};
</script>
