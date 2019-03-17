<template>
  <div>
    <label
      >This supports
      <a
        href="https://guides.github.com/features/mastering-markdown/"
        target="_blank"
        >markdown</a
      >!
      <textarea name="tileText" :value="tile.tileText"></textarea>
    </label>
  </div>
</template>

<script>
export default {
  name: "text-settings",
  props: ["tile"]
};
</script>
