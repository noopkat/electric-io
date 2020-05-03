<template>
  <div>
    <label :for="`deviceId-${tile.id}`">
      Device Id
      <select
        :id="`deviceId-${tile.id}`"
        name="deviceId"
        :value="tile.deviceId"
      >
        <option
          v-for="(device, index) in deviceList"
          :key="`device-list-${index}`"
          :value="device"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <data-property-field
      name="property"
      :value="tile.property"
      :tile-id="tile.id"
    />

    <label :for="`lineColor-${tile.id}`">
      Line Color
      <input
        :id="`lineColor-${tile.id}`"
        v-model="lineColor"
        name="lineColor"
        type="hidden"
      />
    </label>

    <color-picker
      :uid="tile.id"
      :color="lineColor"
      style="--cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
      @change="updateValue"
    />
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
import DataPropertyField from "./DataPropertyField";

export default {
  name: "LineChartSettings",

  components: {
    ColorPicker,
    DataPropertyField
  },

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
