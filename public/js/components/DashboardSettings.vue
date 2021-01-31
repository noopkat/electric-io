<template>
  <div
    class="card settings"
    :class="{ 'settings--closed': !settingsPanelOpen }"
  >
    <div class="settings__header">
      <h2 class="settings__title">
        Settings
      </h2>

      <button
        class="icon-button"
        :aria-expanded="settingsPanelOpen ? 'true' : 'false'"
        type="button"
        @click="onToggleSettingsPanel"
      >
        <span class="sr-only">
          {{ settingsPanelOpen ? "Close" : "Open" }}
          Settings panel
        </span>

        <span
          aria-hidden="true"
          class="emoji-font"
        >
          {{ settingsPanelOpen ? "→" : "⚙️" }}
        </span>
      </button>
    </div>

    <div class="settings__body">
      <form @submit.prevent="onSaveSettings">
        <label for="dashboard-settings-title">
          Dashboard title

          <input
            id="dashboard-settings-title"
            type="text"
            :value="dashboard.title"
          >
        </label>

        <label for="dashboard-settings-bgColor">
          Background color

          <input
            id="dashboard-settings-bgColor"
            v-model="dashboard.bgColor"
            type="hidden"
          >
        </label>

        <ElectricColorPicker
          id="dashboard-settings"
          :color="dashboard.bgColor"
          style-attribute-value="--vacp-focus-color: var(--focus-color)"
          @color-change="updateBackgroundColor"
        />

        <label for="dashboard-settings-background-image-url">
          Background image URL

          <input
            id="dashboard-settings-background-image-url"
            v-model="dashboard.bgImageUrl"
            type="text"
          >
        </label>

        <label
          class="settings__checkbox-label"
          for="dashboard-settings-background-image-repeat"
        >
          <input
            id="dashboard-settings-background-image-repeat"
            v-model="dashboard.bgImageRepeat"
            class="settings__checkbox"
            type="checkbox"
          >

          Repeat background image
        </label>

        <button
          class="thick-button"
          type="submit"
        >
          save
        </button>
      </form>

      <h3>New card</h3>

      <form @submit.prevent="onCreateCard">
        <label for="dashboard-settings-type">
          Card type
          <select
            id="dashboard-settings-type"
            name="type"
          >
            <option value="button">button</option>
            <option value="lineChart">line chart</option>
            <option value="number">number</option>
            <option value="sticker">sticker</option>
            <option value="text">text</option>
          </select>
        </label>

        <button
          class="thick-button"
          type="submit"
        >
          create
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import ElectricColorPicker from "./ElectricColorPicker.vue";
import { saveDashboard } from "../lib/configuration.js";
import templates from "../lib/templates.js";
import createGuid from "../lib/guid.js";

export default {
  name: "DashboardSettings",

  components: {
    ElectricColorPicker
  },

  props: {
    dashboardTitle: {
      type: String,
      required: true
    },

    dashboardBackgroundColor: {
      type: String,
      required: true
    },

    dashboardBackgroundImageUrl: {
      type: String,
      required: false,
      default: ""
    },

    dashboardBackgroundImageRepeat: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      settingsPanelOpen: true,
      dashboard: {
        title: this.dashboardTitle,
        bgColor: this.dashboardBackgroundColor,
        bgImageUrl: this.dashboardBackgroundImageUrl,
        bgImageRepeat: Boolean(this.dashboardBackgroundImageRepeat)
      }
    };
  },

  methods: {
    onSaveSettings() {
      this.$emit("save-settings", this.dashboard);
    },

    onCreateCard(event) {
      const formData = new FormData(event.target);
      const id = createGuid();
      const tileTemplate = templates[formData.get("type")];
      const newTile = Object.assign({}, tileTemplate, { id });

      this.$emit("tile-create", newTile);
    },

    onToggleSettingsPanel() {
      this.settingsPanelOpen = !this.settingsPanelOpen;
    },

    updateBackgroundColor(colorData) {
      this.dashboard.bgColor = colorData.cssColor;
    }
  }
};
</script>

<style scoped>
.settings {
  right: 0;
  top: 50px;
}

.settings:not(.settings--closed) {
  min-width: 280px;
}

.settings__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.settings--closed .settings__header {
  align-items: center;
}

.settings__title {
  margin-bottom: 0;
}

.settings--closed .settings__title {
  display: none;
}

.settings__body {
  margin-top: 15px;
}

.settings--closed .settings__body {
  display: none;
}

.settings__toggle-btn:hover + .settings__title,
.settings__toggle-btn:focus + .settings__title {
  display: block;
}

.settings select {
  width: 100%;
}

.settings__checkbox-label {
  display: flex;
  margin-bottom: 10px;
}

.settings__checkbox {
  margin: 0;
  margin-right: 5px;
}
</style>
