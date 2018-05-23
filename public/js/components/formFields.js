export default Vue.component('form-fields', {
  props: ['tile', 'deviceList'],
  created: function() {
    this.$options.template = this.$options.propsData.tile.template;
  }
});
