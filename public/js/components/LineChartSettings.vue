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

    <label>
      Data Property
      <input type="text" name="property" :value="tile.property" />
    </label>

    <label>
      Line Color
      <input type="text" name="lineColor" :value="tile.lineColor" />
    </label>
  </div>
</template>

<script>
export default {
  name: "line-chart-settings",
  props: ["tile", "deviceList"]
};
</script>
