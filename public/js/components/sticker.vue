<template>
  <img v-bind:src="tile.url" width="100%"/>
</template>

<script>
export default {
  name: 'card-sticker',
  props: ['tile']
};
</script>