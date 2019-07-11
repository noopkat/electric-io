<template>
  <div>
    <label>
      Device Id
      <select name="deviceId" id="deviceSelect">
        <option
          v-for="(device, index) in deviceList"
          :selected="device === tile.deviceId"
          v-bind:key="`device-list-${index}`"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <data-property-field name="property" v-bind:value="tile.property" />

    <label>
      Line Color
      <input type="text" name="lineColor" :value="tile.lineColor" />
    </label>
  </div>
</template>

<script>
import DataPropertyField from "./DataPropertyField";

export default {
  name: "line-chart-settings",
  components: { DataPropertyField },
  props: ["tile", "deviceList"]
};
</script>
