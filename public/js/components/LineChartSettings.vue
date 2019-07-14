<template>
  <div>
    <label :for="`deviceId-${tile.id}`">
      Device Id
      <select name="deviceId" :id="`deviceId-${tile.id}`">
        <option
          v-for="(device, index) in deviceList"
          :selected="device === tile.deviceId"
          :key="`device-list-${index}`"
          >{{ device }}</option
        >
      </select>
    </label>

    <data-property-field
      name="property"
      v-bind:value="tile.property"
      v-bind:tileId="tile.id"
    />

    <label :for="`lineColor-${tile.id}`">
      Line Color
      <input
        type="hidden"
        :id="`lineColor-${tile.id}`"
        name="lineColor"
        v-model="lineColor"
      />
    </label>

    <color-picker
      :uid="tile.id"
      :color="lineColor"
      @change="updateValue"
      style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
    />
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
import DataPropertyField from "./DataPropertyField";

export default {
  name: "line-chart-settings",
  components: {
    ColorPicker,
    DataPropertyField
  },
  props: ["tile", "deviceList"],

  data() {
    return {
      lineColor: this.tile.lineColor
    };
  },

  methods: {
    updateValue(value) {
      this.lineColor = value;
    }
  }
};
</script>
