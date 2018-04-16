/*********************************************************************************
So this is starting to become the gigantic component file that 'does everything'
It would be great to perhaps introduce one more layer of component so that this 
component is not doing so much.

The indenting in this file is also awful which can be fixed very quickly.

- noopkat
*********************************************************************************/
import BaseCard from './card.js';
import SettingsCard from './settings.js';
import {saveDashboard, getDashboard, getDeviceList} from '../lib/configuration.js';
import contrastColor from '../lib/colorContraster.js';

const template = `
  <div id="dashboard" v-bind:style="dashStyle">
    <header>
      <h1 v-bind:style="headingStyle"><span class="hemoji">⚡️</span>electric io</h1>
    </header>

    <main>
      <dashboard-settings v-bind:dashboard="dashboard" v-on:save-settings="onSaveSettings" v-on:tile-create="onTileCreate"/>
      <base-card :key="tile.id" v-for="tile in dashboard.tiles" v-bind:messages="messages.filter((m)=>m.deviceId===tile.deviceId)" v-bind:tile="tile" v-bind:deviceList="deviceList" v-bind:blockSize="dashboard.blockSize" v-on:tile-position="onTileChange" v-on:tile-settings="onTileChange" v-on:tile-delete="onTileDelete" />
    </main>
  </div>
`;

const initialData = function() {
  return {
    dashboard: {
      blockSize: [],
      tiles: []
    },
    messages: [],
    deviceList: [],
  }
};

export default Vue.component('main-app', {
  template,
  components: {BaseCard},
  data: initialData,
  computed: {
    dashStyle: function() {
      return {backgroundColor: this.dashboard.bgColor};
    },
    headingStyle: function() {
      const color = contrastColor(this.dashboard.bgColor, '#fff', '#000');
      return {color};
    }
  },
  methods: {
    onSaveSettings: function(event) {
      this.dashboard = Object.assign({}, this.dashboard, event);
      saveDashboard(this.dashboard)
        .then((r) => console.log(r.ok));
    },
    onTileChange: function(event) {
      const tileIndex = this.dashboard.tiles.findIndex((t) => t.id === event.id);
      const updatedTile  = Object.assign({}, this.dashboard.tiles[tileIndex], event);
      const updatedTiles = this.dashboard.tiles.slice();
      updatedTiles[tileIndex] = updatedTile;
      this.dashboard = Object.assign({}, this.dashboard, {tiles: updatedTiles});
      // TODO: this needs to be handled properly in the UI
      saveDashboard(this.dashboard)
        .then((r) => console.log(r.ok));
    },
    onTileDelete: function(tileId) {
      console.log('on tile delete');
      const updatedTiles = this.dashboard.tiles.filter((t) => t.id !== tileId);
      this.dashboard = Object.assign({}, this.dashboard, {tiles: updatedTiles});
      // TODO: this needs to be handled properly in the UI
      saveDashboard(this.dashboard)
        .then((r) => console.log(r.ok));
    },
    onTileCreate: function(event) {
      const updatedTiles = this.dashboard.tiles.slice();
      updatedTiles.push(event);
      this.dashboard = Object.assign({}, this.dashboard, {tiles: updatedTiles});
      // TODO: this needs to be handled properly in the UI
      saveDashboard(this.dashboard)
        .then((r) => console.log(r.ok));
    },
    onDeviceListReceived: function(deviceList) {
      this.deviceList = deviceList;

        const socket = io();
        socket.on('message', (message) => {
        const deviceId = message.annotations['iothub-connection-device-id']; 
        message.body.deviceId = deviceId;
        message.body.enqueuedTime = message.annotations['iothub-enqueuedtime'];
        if (this.messages.length > 500) this.messages.shift();
        this.messages.push(message.body);
      });
    }
  },
  created() {
    // TODO: handle errors here
    getDashboard().then((r) => this.dashboard = r.dashboard);
    getDeviceList().then((r) => this.onDeviceListReceived(r));
  }
});

