<template>
  <div>
    <label>
      Device Id
      <select name="deviceId" id="deviceSelect">
        <option
          v-for="device in deviceList"
          v-bind:selected="device === tile.deviceId"
          >{{ device }}</option
        >
      </select>
    </label>

    <label>
      Call Type
      <select name="callType" id="callTypeSelect" v-model="tile.callType">
        <option
          v-for="option in typeOptions"
          v-bind:key="option.value"
          v-bind:selected="option.value === tile.callType"
          v-bind:value="option.value"
          >{{ option.text }}</option
        >
      </select>
    </label>

    <label v-if="tile.callType === 'method'">
      Method Name
      <input type="text" name="deviceMethod" v-bind:value="tile.deviceMethod" />
    </label>

    <label>
      <span v-if="tile.callType === 'method'">Method</span>
      <span v-else>Message</span> Payload (must be valid JSON pls!)
      <textarea name="callPayload" v-bind:value="tile.callPayload"></textarea>
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
  props: ["tile", "deviceList"],
  data() {
    return {
      typeOptions: [
        { text: "Direct Method", value: "method" },
        { text: "C2D Message", value: "message" }
      ]
    };
  }
};
</script>
