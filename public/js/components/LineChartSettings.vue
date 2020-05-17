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

    <ElectricColorPicker
      :id="tile.id"
      :color="lineColor"
      style-attribute-value="--vacp-focus-color: var(--focus-color); --vacp-color-space-width: var(--card-form-width)"
      @color-change="updateValue"
    />
  </div>
</template>

<script>
import DataPropertyField from "./DataPropertyField.vue";
import ElectricColorPicker from "./ElectricColorPicker.vue";

export default {
  name: "LineChartSettings",

  components: {
    DataPropertyField,
    ElectricColorPicker
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
    updateValue(colorData) {
      this.lineColor = colorData.cssColor;
    }
  }
};
</script>
