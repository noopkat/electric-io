<template>
  <div
    class="card settings"
    :class="{ 'settings--closed': !settingsPanelOpen }"
  >
    <div class="settings__header">
      <button
        class="settings__toggle-btn"
        @click="onToggleSettingsPanel"
        :aria-expanded="settingsPanelOpen ? 'true' : 'false'"
        aria-labelledby="settings-toggle-label"
      >
        <span class="screen-reader-only" id="settings-toggle-label">{{
          settingsPanelOpen ? "Close settings panel" : "Open settings panel"
        }}</span>
        <span aria-hidden="true">{{
          settingsPanelOpen ? "&rarr;" : "⚙️"
        }}</span>
      </button>
      <h2 class="settings__title">Settings</h2>
    </div>
    <div class="settings__body">
      <form v-on:submit.prevent="onSaveSettings">
        <label
          >App Title
          <input type="text" name="title" :value="dashboard.title" />
        </label>
        <label
          >Background Color
          <input type="text" name="bgColor" v-bind:value="dashboard.bgColor" />
        </label>
        <label
          >Background Image URL
          <input type="text" name="bgImageUrl" :value="dashboard.bgImageUrl" />
        </label>
        <label class="settings__checkbox-label">
          <span>Repeat background image?</span>
          <input
            class="settings__checkbox"
            type="checkbox"
            name="bgImageRepeat"
            :value="dashboard.bgImageRepeat"
            v-model="dashboard.bgImageRepeat"
          />
        </label>
        <input class="action-button" type="submit" value="save" />
      </form>
      <h3>New Card</h3>
      <form v-on:submit.prevent="onCreateCard">
        <label
          >Card Type
          <select name="type">
            <option value="button">button</option>
            <option value="lineChart">line chart</option>
            <option value="number">number</option>
            <option value="sticker">sticker</option>
            <option value="text">text</option>
          </select>
        </label>
        <input class="action-button" type="submit" value="create" />
      </form>
    </div>
  </div>
</template>

<script>
import { saveDashboard } from "../lib/configuration.js";
import templates from "../lib/templates.js";
import createGuid from "../lib/guid.js";

export default {
  name: "dashboard-settings",
  props: ["dashboard"],
  data: function() {
    return {
      status: "",
      settingsPanelOpen: true
    };
  },
  methods: {
    onSaveSettings: function(event) {
      const formData = new FormData(event.target);
      const eventData = {};
      formData.forEach((value, name) => {
        eventData[name] = value;
      });

      this.$emit("save-settings", eventData);
    },
    onCreateCard: function(event) {
      const formData = new FormData(event.target);
      const id = createGuid();
      const tileTemplate = templates[formData.get("type")];
      const newTile = Object.assign({}, tileTemplate, { id });

      this.$emit("tile-create", newTile);
    },
    onToggleSettingsPanel() {
      this.settingsPanelOpen = this.settingsPanelOpen === true ? false : true;
    }
  }
};
</script>
