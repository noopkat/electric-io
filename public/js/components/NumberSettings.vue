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

    <label>
      Data Property
      <input type="text" name="property" v-bind:value="tile.property" />
    </label>

    <label>
      Text Color
      <input type="text" name="textColor" v-bind:value="tile.textColor" />
    </label>
  </div>
</template>

<script>
export default {
  name: "number-settings",
  props: ["tile", "deviceList"]
};
</script>
