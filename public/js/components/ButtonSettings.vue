<template>
  <div>
    <label>
      Device Id
      <select id="deviceSelect" name="deviceId">
        <option
          v-for="(device, index) in deviceList"
          :key="`device-list-option-${index}`"
          selected="device === tile.deviceId"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <label>
      Call Type
      <select id="callTypeSelect" v-model="tile.callType" name="callType">
        <option
          v-for="option in typeOptions"
          :key="option.value"
          :selected="option.value === tile.callType"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </label>

    <label v-if="tile.callType === 'method'">
      Method Name
      <input type="text" name="deviceMethod" :value="tile.deviceMethod" />
    </label>

    <label>
      <span v-if="tile.callType === 'method'">Method</span>
      <span v-else>Message</span> Payload (must be valid JSON pls!)
      <textarea name="callPayload" :value="tile.callPayload" />
    </label>

    <label>
      Button Text
      <input type="text" name="buttonText" :value="tile.buttonText" />
    </label>
  </div>
</template>

<script>
export default {
  name: "ButtonSettings",

  props: {
    tile: {
      type: Object,
      required: true
    },
    deviceList: {
      type: Array,
      required: true
    }
  },

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
