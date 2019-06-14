<template>
  <div>
    <label>
      Picture URL
      <input type="text" name="url" v-bind:value="tile.url" />
    </label>
    <label>
      Picture Alt Text
      <a
        href="https://axesslab.com/alt-texts#lets-create-the-perfect-alt-text"
        target="_blank"
        >(what's this?)</a
      >
      <textarea name="altText" maxlength="150" v-bind:value="tile.altText" />
      max length: 150 char
    </label>
  </div>
</template>

<script>
export default {
  name: "sticker-settings",
  props: ["tile"]
};
</script>
