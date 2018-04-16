const template = `<img v-bind:src="tile.url" width="100%"/>`;

export default Vue.component('card-sticker', {
  template,
  props: ['tile']
});

