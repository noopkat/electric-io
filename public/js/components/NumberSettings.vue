<template>
  <div>
    <label :for="`deviceId-${tile.id}`">
      Device Id
      <select name="deviceId" :id="`deviceId-${tile.id}`">
        <option
          v-for="(device, index) in deviceList"
          :selected="device === tile.deviceId"
          :key="`device-list-${index}`"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <data-property-field
      name="property"
      v-bind:value="tile.property"
      v-bind:tileId="tile.id"
    />

    <label :for="`textColor-${tile.id}`">
      Text Color
      <input
        type="hidden"
        :id="`textColor-${tile.id}`"
        name="textColor"
        v-model="textColor"
      />
    </label>

    <color-picker
      :uid="tile.id"
      :color="textColor"
      @change="updateValue"
      style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
    />
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
import DataPropertyField from "./DataPropertyField";

export default {
  name: "number-settings",
  props: ["tile", "deviceList"],
  components: {
    ColorPicker,
    DataPropertyField
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
