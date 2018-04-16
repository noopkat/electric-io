/* 
*** WARNING ****
This file is a hot mess. It could do with some love and refactoring. - noopkat

*/
import {saveDashboard} from '../lib/configuration.js';
// focus management mixin
import {focus} from '../vendor/vue-focus.js';

// TODO:
// what I'd like to see here instead is to use a declarative object template for each card
// each object specifies which fields it needs and the name, etc
// we can look these up based on the tile's properties itself, so it should be a neat refactor?
// title and id are constant fields we always need, along with the 'save' button
// this would clean up the entire component file immensely!
// - noopkat
const template = `
  <div class="cardForm">
    <h2>Settings</h2>

    <form v-on:submit.prevent="onSubmit">
      <input name="id" type="hidden" v-bind:value="tile.id"/>

      <label>Title
        <input v-focus="editing" type="text" name="title" v-bind:value="tile.title"/>
      </label>

      <label v-if="showDeviceList">Device Id
        <select name="deviceId" id="deviceSelect" >
            <option v-for="device in deviceList" v-bind:selected="device===tile.deviceId">
              {{device}}
            </option>
         </select>
       </label>
      
      <label v-if="showPropInput">Data Property
        <input type="text" name="property" v-bind:value="tile.property"/>
      </label>

      <label v-if="showMethodInput">Method Name
        <input type="text" name="deviceMethod" v-bind:value="tile.deviceMethod"/>
      </label>

      <label v-if="showColorInput">Line Color
        <input type="text" name="lineColor" v-bind:value="tile.lineColor"/>
      </label>

      <label v-if="showUrlInput">Picture URL
        <input type="text" name="url" v-bind:value="tile.url"/>
      </label>

      <label v-if="showButtonTextInput">Button Text
        <input type="text" name="buttonText" v-bind:value="tile.buttonText"/>
      </label>

      <label v-if="showTextColorInput">Text Color
        <input type="text" name="textColor" v-bind:value="tile.textColor"/>
      </label>

      <input type="submit" value="save" />
    </form>
  </div>
`;

export default Vue.component('card-form', {
  directives: {focus},
  template,
  props: ["tile", "deviceList", "editing"],
  computed: {
    showPropInput: function() {
      return this.tile.type !== "sticker" && this.tile.type !== "button";
    },
    showMethodInput: function() {
      return this.tile.type === "button";
    },
    showColorInput: function() {
      return this.tile.type === "lineChart";
    },
    showDeviceList: function() {
      return this.tile.type !== "sticker";
    },
    showUrlInput: function() {
      return this.tile.type === "sticker";
    },
    showButtonTextInput: function() {
      return this.tile.type === "button";
    },
    showTextColorInput: function() {
      return this.tile.type === "number";
    }
  },
  methods: {
    onSubmit: function(event) {
      let eventData = {};
      const formData = new FormData(event.target);
      formData.forEach((value, name) => {
        eventData[name] = value;
      });
      this.$emit('save-settings', eventData);
    }
  },
});

