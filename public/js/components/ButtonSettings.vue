<template>
  <div>
    <label>
      Device Id
      <select id="deviceSelect" name="deviceId" :value="tile.deviceId">
        <option
          v-for="(device, index) in deviceList"
          :key="`device-list-option-${index}`"
          :value="device"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <label>
      Call Type
      <select
        id="callTypeSelect"
        v-model="tile.callType"
        name="callType"
        :value="tile.callType"
      >
        <option
          v-for="option in typeOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </label>

    <label v-if="tile.callType === 'method'" for="deviceMethod">
      Method Name
      <input
        id="deviceMethod"
        name="deviceMethod"
        type="text"
        :value="tile.deviceMethod"
      />
    </label>

    <label for="callPayload">
      <span v-if="tile.callType === 'method'">Method</span>
      <span v-else>Message</span> Payload (must be valid JSON pls!)
      <textarea id="callPayload" name="callPayload" :value="tile.callPayload" />
    </label>

    <label for="buttonText">
      Button Text
      <input
        id="buttonText"
        name="buttonText"
        type="text"
        :value="tile.buttonText"
      />
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
