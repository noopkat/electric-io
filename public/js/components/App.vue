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
        :block-size="dashboard.blockSize"
        @tile-position="onTileChange"
        @tile-settings="onTileChange"
        @tile-delete="onTileDelete"
      />
    </main>
  </div>
</template>

<script>
import io from "socket.io-client";
import BaseCard from "./BaseCard";
import DashboardSettings from "./DashboardSettings";
import {
  saveDashboard,
  getDashboard,
  getDeviceList
} from "../lib/configuration.js";

import contrastColor from "../lib/colorContraster.js";
import { TITLE_EMOJI_REGEX } from "../utils/constants.js";

export default {
  name: "App",
  components: { BaseCard, DashboardSettings },

  data() {
    return {
      dashboard: {
        blockSize: [],
        tiles: []
      },
      messages: [],
      deviceList: [],
      simulating: SIMULATING
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

  created() {
    // TODO: handle errors here
    getDashboard().then(r => (this.dashboard = r.dashboard));
    getDeviceList().then(r => this.onDeviceListReceived(r));
  },

  methods: {
    onSaveSettings(event) {
      this.dashboard = Object.assign({}, this.dashboard, event);
      saveDashboard(this.dashboard).then(r => console.log(r.ok));
    },

    onTileChange(event) {
      const tileIndex = this.dashboard.tiles.findIndex(t => t.id === event.id);
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

      // TODO: this needs to be handled properly in the UI
      saveDashboard(this.dashboard).then(r => console.log(r.ok));
    },

    onTileDelete(tileId) {
      const updatedTiles = this.dashboard.tiles.filter(t => t.id !== tileId);
      this.dashboard = Object.assign({}, this.dashboard, {
        tiles: updatedTiles
      });

      // TODO: this needs to be handled properly in the UI
      saveDashboard(this.dashboard).then(r => console.log(r.ok));
    },

    onTileCreate(event) {
      const updatedTiles = this.dashboard.tiles.slice();
      updatedTiles.push(event);
      this.dashboard = Object.assign({}, this.dashboard, {
        tiles: updatedTiles
      });

      // TODO: this needs to be handled properly in the UI
      saveDashboard(this.dashboard).then(r => console.log(r.ok));
    },

    onDeviceListReceived(deviceList) {
      this.deviceList = deviceList;

      const socket = io();
      socket.on("message", message => {
        const deviceId = message.annotations["iothub-connection-device-id"];
        message.body.deviceId = deviceId;
        message.body.enqueuedTime = message.annotations["iothub-enqueuedtime"];
        if (this.messages.length > 500) this.messages.shift();
        this.messages.push(message.body);
      });
    }
  }
};
</script>
