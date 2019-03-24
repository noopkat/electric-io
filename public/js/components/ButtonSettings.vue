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
      Method Name
      <input type="text" name="deviceMethod" v-bind:value="tile.deviceMethod" />
    </label>

    <label>
      Method Payload (must be valid JSON pls!)
      <textarea
        name="deviceMethodPayload"
        v-bind:value="tile.deviceMethodPayload"
      ></textarea>
    </label>

    <label>
      Button Text
      <input type="text" name="buttonText" v-bind:value="tile.buttonText" />
    </label>
  </div>
</template>

<script>
export default {
  name: "button-settings",
  props: ["tile", "deviceList"]
};
</script>
