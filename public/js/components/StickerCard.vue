<template>
  <img
    v-bind:src="tile.url"
    v-bind:title="tile.altText"
    v-bind:alt="tile.altText"
    width="100%"
  />
</template>

<script>
export default {
  name: "sticker-card",
  props: ["tile"]
};
</script>
