<template>
  <p class="number" :style="numberStyle">{{ number }}</p>
</template>

<script>
import { evaluatePath } from "../lib/messagePropertyEvaluation.js";

export default {
  name: "NumberCard",

  props: {
    tile: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      number: 0
    };
  },

  computed: {
    numberStyle() {
      return { color: this.tile.textColor };
    }
  },

  watch: {
    messages() {
      const lastMessage = this.messages.pop();
      if (lastMessage) {
        const value = evaluatePath(this.tile.property, lastMessage);
        this.number = parseFloat(value).toFixed(1);
      } else {
        this.number = 0;
      }
    }
  }
};
</script>
