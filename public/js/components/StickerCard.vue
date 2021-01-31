<template>
  <img
    :src="tile.url"
    :title="tile.altText"
    :alt="tile.altText"
    width="100%"
  >
</template>

<script>
export default {
  name: "StickerCard",

  props: {
    tile: {
      type: Object,
      required: true
    }
  }
};
</script>
