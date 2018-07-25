<template>
  <img v-bind:src="tile.url" width="100%"/>
</template>

<script>
export default {
  name: 'sticker-card',
  props: ['tile']
};
</script>