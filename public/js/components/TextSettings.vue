<template>
  <div>
    <label>
      This supports

      <a
        href="https://guides.github.com/features/mastering-markdown/"
        target="_blank"
      >markdown</a>!

      <textarea
        name="tileText"
        :value="tile.tileText"
      />
    </label>
  </div>
</template>

<script>
export default {
  name: "TextSettings",

  props: {
    tile: {
      type: Object,
      required: true
    }
  }
};
</script>
