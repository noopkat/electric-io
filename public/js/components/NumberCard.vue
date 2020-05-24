<template>
  <p class="number" :style="numberStyle">{{ numberValue }}</p>
</template>

<script>
import { evaluatePath } from "../lib/messagePropertyEvaluation.js";
import convert from "../lib/colorConversions.js";
import { mixHsv, ilerp } from "../lib/colorInterpolation.js";

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
      number: null
    };
  },

  computed: {
    numberStyle() {
      return { color: this.getColor() };
    },

    numberValue() {
      if (this.number !== null) {
        return this.number.toString();
      } else {
        return "🤔";
      }
    }
  },

  watch: {
    messages() {
      const lastMessage = this.messages[this.messages.length - 1];
      if (lastMessage) {
        const value = evaluatePath(this.tile.property, lastMessage);
        this.number = parseFloat(value).toFixed(1);
      } else {
        this.number = null;
      }
    }
  },

  methods: {
    getColor() {
      if (this.tile.textColorMode === "single") {
        return this.tile.textColor;
      }

      if (this.tile.textColorMode === "gradient") {
        const { lowValue, lowTextColor, highValue, highTextColor } = this.tile;
        const from = convert.css.hsv(lowTextColor);
        const to = convert.css.hsv(highTextColor);
        const factor = ilerp(lowValue, highValue, this.number);
        const hsv = mixHsv(from, to, factor);
        return convert.hsv.hex(hsv);
      }

      return "#000000ff";
    }
  }
};
</script>

<style scoped>
.number {
  margin: 0;
  padding: 0;
  font-family: "Chivo", sans-serif;
  font-size: 64px;
  font-weight: bold;
  text-align: center;
}
</style>
