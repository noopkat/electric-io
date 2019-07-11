<template>
  <div>
    <label>
      Device Id
      <select name="deviceId" id="deviceSelect">
        <option
          v-for="device in deviceList"
          v-bind:selected="device === tile.deviceId"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <data-property-field name="property" v-bind:value="tile.property" />

    <label>
      Text Color
      <input type="text" name="textColor" v-bind:value="tile.textColor" />
    </label>
  </div>
</template>

<script>
import DataPropertyField from "./DataPropertyField";

export default {
  name: "number-settings",
  components: { DataPropertyField },
  props: ["tile", "deviceList"]
};
</script>
