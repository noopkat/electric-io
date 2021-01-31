<template>
  <component
    :is="settingsCard"
    :tile="tile"
    :device-list="deviceList"
  />
</template>

<script>
import ButtonSettings from "./ButtonSettings";
import LineChartSettings from "./LineChartSettings";
import NumberSettings from "./NumberSettings";
import StickerSettings from "./StickerSettings";
import TextSettings from "./TextSettings";

export default {
  name: "FormFields",

  components: {
    ButtonSettings,
    LineChartSettings,
    NumberSettings,
    StickerSettings,
    TextSettings
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

  computed: {
    settingsCard() {
      return `${this.tile.type.toLowerCase()}-settings`;
    }
  }
};
</script>
