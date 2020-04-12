<template>
  <div id="dashboard">
    <header>
      <h1 :style="headingStyle" v-html="appTitle" />

      <div v-if="simulating" :style="headingStyle" class="simulation-status">
        ⚠️ Using simulated data
      </div>
    </header>

    <main>
      <dashboard-settings
        v-if="showSettings"
        :dashboard="dashboard"
        @save-settings="onSaveSettings"
        @tile-create="onTileCreate"
      />

      <base-card
        v-for="tile in dashboard.tiles"
        :key="tile.id"
        :edit-mode="dashboard.editMode"
        :messages="messages.filter(m => m.deviceId === tile.deviceId)"
        :tile="tile"
        :device-list="deviceList"
        :block-width="dashboard.blockSize[0]"
        :block-height="dashboard.blockSize[1]"
        @tile-position="onTilePositionChange"
        @tile-settings="onTileSettingsChange"
        @tile-delete="onTileDelete"
      />
    </main>

    <ElectricToaster :toasts="electricToasts" />
  </div>
</template>

<script>
import io from "socket.io-client";

import BaseCard from "./BaseCard.vue";
import DashboardSettings from "./DashboardSettings.vue";
import ElectricToaster from "./electric-toaster/ElectricToaster.vue";

import {
  saveDashboard,
  getDashboard,
  getDeviceList
} from "../lib/configuration.js";
import contrastColor from "../lib/colorContraster.js";
import { TITLE_EMOJI_REGEX } from "../utils/constants.js";

export default {
  name: "App",

  components: {
    BaseCard,
    DashboardSettings,
    ElectricToaster
  },

  data() {
    return {
      dashboard: {
        blockSize: [],
        tiles: []
      },
      messages: [],
      deviceList: [],
      simulating: SIMULATING,
      electricToasts: []
    };
  },

  computed: {
    /**
     * @returns {{ color: String }}
     */
    headingStyle() {
      const color = contrastColor(this.dashboard.bgColor, "#fff", "#000");

      if (color !== null) {
        return { color };
      }

      return { color: "#000" };
    },

    /**
     * @returns {Boolean}
     */
    showSettings() {
      const allowedModes = ["unlocked", "demo"];
      return allowedModes.includes(this.dashboard.editMode);
    },

    /**
     * @returns {String}
     */
    appTitle() {
      const title = TITLE_EMOJI_REGEX.exec(this.dashboard.title);

      if (title !== null) {
        return `<span class="hemoji">${title[1]}</span>${title[2]}`;
      }

      return this.dashboard.title;
    }
  },

  watch: {
    "dashboard.bgColor": function(bgColor) {
      document.body.style.setProperty("--background-color", bgColor);
    },

    "dashboard.bgImageUrl": function(bgImageUrl) {
      const bgImage = bgImageUrl !== "" ? `url(${bgImageUrl})` : "";
      document.body.style.setProperty("--background-image", bgImage);
    },

    "dashboard.bgImageRepeat": function(bgImageRepeat) {
      const bgRepeat = Boolean(bgImageRepeat) ? "repeat" : "no-repeat";
      document.body.style.setProperty("--background-repeat", bgRepeat);
    }
  },

  async created() {
    try {
      const response = await getDashboard();
      this.dashboard = response.dashboard;
    } catch (error) {
      this.createElectricToast({
        content: `🚨 ${error.message}`,
        shouldAutoDismiss: false
      });
    }

    try {
      const response = await getDeviceList();
      this.onDeviceListReceived(response);
    } catch (error) {
      this.createElectricToast({
        content: `🚨 ${error.message}`,
        shouldAutoDismiss: false
      });
    }
  },

  methods: {
    async onSaveSettings(event) {
      this.dashboard = Object.assign({}, this.dashboard, event);

      try {
        const response = await saveDashboard(this.dashboard);
        this.createElectricToast({ content: `💾 ${response.data.message}` });
      } catch (error) {
        this.createElectricToast({ content: `🚨 ${error.message}` });
      }
    },

    onTilePositionChange(event) {
      this.onTileChange(event);
    },

    async onTileSettingsChange(event) {
      try {
        const response = await this.onTileChange(event);
        this.createElectricToast({ content: "💾 Card saved." });
      } catch (error) {}
    },

    async onTileChange(event) {
      const tileIndex = this.dashboard.tiles.findIndex(
        tile => tile.id === event.id
      );
      const updatedTile = Object.assign(
        {},
        this.dashboard.tiles[tileIndex],
        event
      );
      const updatedTiles = this.dashboard.tiles.slice();
      updatedTiles[tileIndex] = updatedTile;
      this.dashboard = Object.assign({}, this.dashboard, {
        tiles: updatedTiles
      });

      try {
        return await saveDashboard(this.dashboard);
      } catch (error) {
        this.createElectricToast({ content: `🚨 ${error.message}` });
      }
    },

    async onTileDelete(tileId) {
      const updatedTiles = this.dashboard.tiles.filter(t => t.id !== tileId);
      this.dashboard = Object.assign({}, this.dashboard, {
        tiles: updatedTiles
      });

      try {
        await saveDashboard(this.dashboard);
        this.createElectricToast({ content: "🚮 Card deleted." });
      } catch (error) {
        this.createElectricToast({ content: `🚨 ${error.message}` });
      }
    },

    async onTileCreate(event) {
      const updatedTiles = this.dashboard.tiles.slice();
      updatedTiles.push(event);
      this.dashboard = Object.assign({}, this.dashboard, {
        tiles: updatedTiles
      });

      try {
        await saveDashboard(this.dashboard);
      } catch (error) {
        this.createElectricToast({ content: `🚨 ${error.message}` });
      }
    },

    onDeviceListReceived(deviceList) {
      this.deviceList = deviceList;

      const socket = io();
      socket.on("message", message => {
        if (!("systemProperties" in message)) {
          return;
        }

        const deviceId =
          message.systemProperties["iothub-connection-device-id"];
        message.body.deviceId = deviceId;
        message.body.enqueuedTime =
          message.systemProperties["iothub-enqueuedtime"];
        if (this.messages.length > 500) this.messages.shift();
        this.messages.push(message.body);
      });
    },

    /**
     * Creates a new electric toast object.
     *
     * @param {object} electricToastOptions
     *   An electric toast options object.
     *   Its only required property is “content”.
     *   Optionally, you can provide an option for
     *   whether the toast should be automatically dismissed
     *   and how long the dismiss timeout should be.
     */
    createElectricToast({
      content,
      shouldAutoDismiss = true,
      autoDismissTimeoutInSeconds = 5
    }) {
      const nextToastIndex = this.electricToasts.length + 1;
      const toast = {
        id: `toast-${nextToastIndex}`,
        content,
        shouldAutoDismiss
      };

      this.electricToasts.push(toast);
    }
  }
};
</script>
