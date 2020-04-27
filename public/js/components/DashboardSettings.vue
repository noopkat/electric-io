<template>
  <div
    class="card settings"
    :class="{ 'settings--closed': !settingsPanelOpen }"
  >
    <div class="settings__header">
      <button
        class="settings__toggle-btn"
        aria-labelledby="settings-toggle-label"
        :aria-expanded="settingsPanelOpen ? 'true' : 'false'"
        @click="onToggleSettingsPanel"
      >
        <span id="settings-toggle-label" class="sr-only">
          {{
            settingsPanelOpen ? "Close settings panel" : "Open settings panel"
          }}
        </span>

        <span aria-hidden="true" class="emoji-font">
          {{ settingsPanelOpen ? "→" : "⚙️" }}
        </span>
      </button>

      <h2 class="settings__title">
        Settings
      </h2>
    </div>

    <div class="settings__body">
      <form @submit.prevent="onSaveSettings">
        <label for="dashboard-settings-title">
          App Title
          <input
            id="dashboard-settings-title"
            type="text"
            name="title"
            :value="dashboard.title"
          />
        </label>

        <label for="dashboard-settings-bgColor">
          Background Color
          <input
            id="dashboard-settings-bgColor"
            v-model="bgColor"
            type="hidden"
            name="bgColor"
          />
        </label>

        <color-picker
          :uid="'dashboard-settings'"
          :color="bgColor"
          style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color)"
          @change="updateValue"
        />

        <label for="dashboard-settings-bgImageUrl">
          Background Image URL
          <input
            id="dashboard-settings-bgImageUrl"
            type="text"
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
            id="dashboard-settings-bgImageRepeat"
            v-model="dashboard.bgImageRepeat"
            class="settings__checkbox"
            type="checkbox"
            name="bgImageRepeat"
            :value="dashboard.bgImageRepeat"
          />
        </label>

        <button class="thick-button" type="submit">
          save
        </button>
      </form>

      <h3>New Card</h3>

      <form @submit.prevent="onCreateCard">
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

        <button class="thick-button" type="submit">
          create
        </button>
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
  name: "DashboardSettings",

  components: {
    ColorPicker
  },

  props: {
    dashboard: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      status: "",
      settingsPanelOpen: true,
      bgColor: this.dashboard.bgColor
    };
  },

  methods: {
    onSaveSettings(event) {
      const formData = new FormData(event.target);
      const eventData = {};
      formData.forEach((value, name) => {
        eventData[name] = value;
      });

      this.$emit("save-settings", eventData);
    },

    onCreateCard(event) {
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

<style scoped>
.settings {
  min-width: 280px;
  right: 0;
  top: 50px;
}

.settings__header {
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.settings--closed {
  min-width: auto;
}

.settings--closed .settings__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.settings--closed .settings__title {
  display: none;
  margin: 0 15px 0 0;
}

.settings--closed .settings__body {
  display: none;
}

.settings .settings__toggle-btn {
  background-color: transparent;
  border: 2px solid #fff;
  border-radius: 0;
  box-shadow: none;
  color: #000;
  padding: 2px;
}

.settings .settings__toggle-btn:hover {
  transform: none;
  box-shadow: none;
}

.settings__toggle-btn:hover + .settings__title,
.settings__toggle-btn:focus + .settings__title {
  display: block;
}

.settings select {
  width: 100%;
}

.settings__checkbox-label {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 10px;
}

.settings__checkbox {
  margin: 0 0 0 5px;
  width: auto;
}
</style>
