<template>
  <div>
    <label>
      Picture URL
      <input
        type="text"
        name="url"
        :value="tile.url"
      >
    </label>

    <label>
      Picture Alt Text

      <a
        href="https://axesslab.com/alt-texts#lets-create-the-perfect-alt-text"
        target="_blank"
      >
        (what's this?)
      </a>

      <textarea
        name="altText"
        maxlength="150"
        :value="tile.altText"
      />

      <span class="max-length-info">max length: 150 char</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "StickerSettings",

  props: {
    tile: {
      type: Object,
      required: true
    }
  }
};
</script>
