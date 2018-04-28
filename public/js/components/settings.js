import {saveDashboard} from '../lib/configuration.js';
import templates from '../lib/templates.js';
import createGuid from '../lib/guid.js';

const template = `
  <div class="card" id="settings">
    <h2>Settings</h2>
    <form v-on:submit.prevent="onSaveSettings">
      <label>Background Color
        <input type="text" name="bgColor" v-bind:value="dashboard.bgColor" />
      </label>
      <label>Background Image URL
        <input type="text" name="bgImageUrl" :value="dashboard.bgImageUrl" />
      </label>
      <label class="settings__checkbox-label">
        <span>Repeat background image?</span>
        <input class="settings__checkbox" type="checkbox" name="bgImageRepeat" :value="dashboard.bgImageRepeat" v-model="dashboard.bgImageRepeat" />
      </label>
      <input type="submit" value="save"/>
    </form>
    <h3>New Card</h3>
    <form v-on:submit.prevent="onCreateCard">
      <label>Card Type
        <select name="type">
          <option value="button">button</option>
          <option value="lineChart">line chart</option>
          <option value="number">number</option>
          <option value="sticker">sticker</option>
          <option value="text">text</option>
        </select>
      </label>
      <input type="submit" value="create"/>
    </form>
  </div>
`;

export default Vue.component('dashboard-settings', {
  template,
  props: ['dashboard'],
  data: function() {
    return {
      status: ''
    }
  },
  methods: {
    onSaveSettings: function(event) {
      const formData = new FormData(event.target);
      const eventData = {};
      formData.forEach((value, name) => {
        eventData[name] = value;
      });
      
      this.$emit('save-settings', eventData);
    },
    onCreateCard: function(event) {
      const formData = new FormData(event.target);
      const id = createGuid();
      const tileTemplate = templates[formData.get('type')];
      const newTile = Object.assign({}, tileTemplate, {id});

      this.$emit('tile-create', newTile);
    }
  }
});

