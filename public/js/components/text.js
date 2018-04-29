const template = `
  <div>
    <div v-html="compiledMarkdown"></div>
  </div>`;

export default Vue.component('card-text', {
  template,
  props: ["tile"],
  data: function() {
    return {
      tileText: ''
    }
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.tile.tileText, {sanitize: true})
    }
  }
});

