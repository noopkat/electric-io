<template>
  <div>
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import marked from "marked";
export default {
  name: "text-card",
  props: ["tile"],
  data: function() {
    return {
      tileText: ""
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.tile.tileText, { sanitize: true });
    }
  }
};
</script>
