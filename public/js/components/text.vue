<template>
  <div>
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
export default {
  name: 'card-text',
  template,
  props: ['tile'],
  data: function() {
    return {
      tileText: ''
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.tile.tileText, { sanitize: true });
    }
  }
};
</script>
