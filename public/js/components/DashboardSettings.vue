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
        <span class="screen-reader-only" id="settings-toggle-label">
          {{
            settingsPanelOpen ? "Close settings panel" : "Open settings panel"
          }}
        </span>

        <span aria-hidden="true">
          {{ settingsPanelOpen ? "&rarr;" : "⚙️" }}
        </span>
      </button>

      <h2 class="settings__title">Settings</h2>
    </div>

    <div class="settings__body">
      <form v-on:submit.prevent="onSaveSettings">
        <label for="dashboard-settings-title">
          App Title
          <input
            type="text"
            id="title"
            name="dashboard-settings-title"
            :value="dashboard.title"
          />
        </label>

        <label for="dashboard-settings-bgColor">
          Background Color
          <input
            type="hidden"
            id="dashboard-settings-bgColor"
            name="bgColor"
            v-model="bgColor"
          />
        </label>

        <color-picker
          :uid="'dashboard-settings'"
          :color="bgColor"
          @change="updateValue"
          style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color)"
        />

        <label for="dashboard-settings-bgImageUrl">
          Background Image URL
          <input
            type="text"
            id="dashboard-settings-bgImageUrl"
            name="bgImageUrl"
            :value="dashboard.bgImageUrl"
          />
        </label>

        <label
          class="settings__checkbox-label"
          for="dashboard-settings-bgImageRepeat"
        >
          <span>Repeat background image?</span>
          <input
            class="settings__checkbox"
            type="checkbox"
            id="dashboard-settings-bgImageRepeat"
            name="bgImageRepeat"
            :value="dashboard.bgImageRepeat"
            v-model="dashboard.bgImageRepeat"
          />
        </label>

        <input class="action-button" type="submit" value="save" />
      </form>

      <h3>New Card</h3>

      <form v-on:submit.prevent="onCreateCard">
        <label for="dashboard-settings-type">
          Card Type
          <select id="dashboard-settings-type" name="type">
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
import ColorPicker from "./ColorPicker";
import { saveDashboard } from "../lib/configuration.js";
import templates from "../lib/templates.js";
import createGuid from "../lib/guid.js";

export default {
  name: "dashboard-settings",
  props: ["dashboard"],
  components: {
    ColorPicker
  },
  data() {
    return {
      status: "",
      settingsPanelOpen: true,
      bgColor: this.dashboard.bgColor
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
    },
    updateValue(value) {
      this.bgColor = value;
    }
  }
};
</script>
