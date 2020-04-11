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

    <label :for="`textColor-${tile.id}`">
      Text Color
      <input
        :id="`textColor-${tile.id}`"
        v-model="textColor"
        type="hidden"
        name="textColor"
      />
    </label>

    <color-picker
      :uid="tile.id"
      :color="textColor"
      style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
      @change="updateValue"
    />
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
import DataPropertyField from "./DataPropertyField";

export default {
  name: "NumberSettings",

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
      textColor: this.tile.textColor
    };
  },

  methods: {
    updateValue(value) {
      this.textColor = value;
    }
  }
};
</script>
