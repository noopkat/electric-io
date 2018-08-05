<script>
export default {
  name: 'form-fields',
  props: ['tile', 'deviceList'],
  created: function() {
    this.$options.template = this.$options.propsData.tile.template;
  }
}
</script>