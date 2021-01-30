<template>
  <component
    :is="settingsCard"
    :tile="tile"
    :device-list="deviceList"
  />
</template>

<script>
import ButtonSettings from "./ButtonSettings.vue";
import LineChartSettings from "./LineChartSettings.vue";
import NumberSettings from "./NumberSettings.vue";
import StickerSettings from "./StickerSettings.vue";
import TextSettings from "./TextSettings.vue";

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
