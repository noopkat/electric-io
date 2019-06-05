<template>
  <component
    v-bind:is="settingsCard"
    v-bind:tile="tile"
    v-bind:deviceList="deviceList"
  ></component>
</template>

<script>
import ButtonSettings from "./ButtonSettings";
import LineChartSettings from "./LineChartSettings";
import NumberSettings from "./NumberSettings";
import StickerSettings from "./StickerSettings";
import TextSettings from "./TextSettings";

export default {
  name: "form-fields",
  props: ["tile", "deviceList"],
  components: {
    ButtonSettings,
    LineChartSettings,
    NumberSettings,
    StickerSettings,
    TextSettings
  },
  computed: {
    settingsCard: function() {
      console.log(this.tile);
      return `${this.tile.type.toLowerCase()}-settings`;
    }
  }
};
</script>
