// focus management mixin
import FormFields from './formFields';
import { focus } from '../vendor/vue-focus.js';

const template = `
  <div class="cardForm">
    <h2>Settings</h2>

    <form v-on:submit.prevent="onSubmit">
      <input name="id" type="hidden" :value="tile.id"/>

      <label>Title
        <input v-focus="editing" type="text" name="title" :value="tile.title"/>
      </label>

      <form-fields :tile="tile" :deviceList="deviceList" />

      <input type="submit" value="save" />
    </form>
  </div>
`;

export default Vue.component('card-form', {
  directives: { focus },
  components: { FormFields },
  template,
  props: ['tile', 'deviceList', 'editing'],
  methods: {
    onSubmit: function(event) {
      let eventData = {};
      const formData = new FormData(event.target);
      formData.forEach((value, name) => {
        eventData[name] = value;
      });
      this.$emit('save-settings', eventData);
    }
  }
});
