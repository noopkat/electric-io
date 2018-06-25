<template>
  <div>
    <button v-on:click="onClick">{{tile.buttonText}}</button>
    <p v-bind:class="statusClass">{{statusText}}</p>
  </div>
</template>

<script>
export default {
  name: 'card-button',
  props: ["tile"],
  data: function() {
    return {
      apiUrl: `/api/device/${this.tile.deviceId}/method/${this.tile.deviceMethod}`,
      statusText: '',
      statusClass: 'status'
    }
  },
  methods: {
    onClick: function() {
      this.statusText = 'calling device method...';
      fetch(this.apiUrl, {method: 'POST'})
        .then((r) => {
          if (r.ok) {
            this.statusText = 'done!';
            this.statusClass = 'status success';
          } else {
            this.statusText = 'oops, that device method might not exist!';
            this.statusClass = 'status error';
          }
        }).catch((error) => this.statusText = 'something went wrong...');
    }
  }
}
</script>