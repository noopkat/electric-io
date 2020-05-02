<template>
  <div class="dashboard">
    <header>
      <h1 class="dashboard-title" :style="headingStyle">
        <template
          v-if="
            Array.isArray(dashboardTitleEmojified) &&
              dashboardTitleEmojified.length === 3
          "
        >
          <span class="dashboard-title__hemoji emoji-font">{{
            dashboardTitleEmojified[1]
          }}</span
          >{{ dashboardTitleEmojified[2] }}
        </template>

        <template v-else>
          {{ dashboardTitle }}
        </template>
      </h1>

      <div
        v-if="simulating"
        class="dashboard-simulation-status"
        :style="headingStyle"
      >
        ⚠️ Using simulated data
      </div>
    </header>

    <main>
      <dashboard-settings
        v-if="showSettings"
        :dashboard-title="dashboard.title"
        :dashboard-background-color="dashboard.bgColor"
        :dashboard-background-image-url="dashboard.bgImageUrl"
        :dashboard-background-image-repeat="Boolean(dashboard.bgImageRepeat)"
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
  getDashboard,
  getDeviceList,
  saveDashboard
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

    dashboardTitle() {
      return this.dashboard.title ? this.dashboard.title : "\u26a1electric io";
    },

    dashboardTitleEmojified() {
      return TITLE_EMOJI_REGEX.exec(this.dashboardTitle);
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
      this.dashboard = await getDashboard();
    } catch (error) {
      this.createElectricToast({
        content: `🚨 ${error.message}`,
        shouldAutoDismiss: false
      });
    }

    try {
      const deviceList = await getDeviceList();
      this.onDeviceListReceived(deviceList);
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
        await saveDashboard(this.dashboard);
        this.createElectricToast({ content: "💾 Saved dashboard." });
      } catch (error) {
        this.createElectricToast({ content: `🚨 ${error.message}` });
      }
    },

    onTilePositionChange(event) {
      this.onTileChange(event);
    },

    async onTileSettingsChange(event) {
      try {
        await this.onTileChange(event);
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

<style scoped>
.dashboard {
  padding: 25px;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.dashboard-title {
  margin-top: 0;
  margin-bottom: 0;
  font-family: "Nanum Pen Script", sans-serif;
  font-size: 50px;
  font-weight: bold;
  color: #000;
}

.dashboard-title__hemoji {
  font-size: 0.8em;
}

.dashboard-simulation-status {
  position: absolute;
  top: 5px;
  right: 10px;
  font-family: "Chivo", sans-serif;
  font-size: 0.875rem;
}
</style>
