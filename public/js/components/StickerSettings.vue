<template>
  <div>
    <label
      >Picture URL
      <input type="text" name="url" v-bind:value="tile.url" />
    </label>
  </div>
</template>

<script>
export default {
  name: "sticker-settings",
  props: ["tile"]
};
</script>
