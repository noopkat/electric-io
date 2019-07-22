<template>
  <div>
    <div v-html="compiledMarkdown" />
  </div>
</template>

<script>
import marked from "marked";
export default {
  name: "TextCard",

  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      tileText: ""
    };
  },

  computed: {
    /**
     * @returns {String}
     */
    compiledMarkdown() {
      return marked(this.tile.tileText, { sanitize: true });
    }
  }
};
</script>
