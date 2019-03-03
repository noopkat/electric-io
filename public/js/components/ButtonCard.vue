<template>
  <div>
    <button v-on:click="onClick">{{ tile.buttonText }}</button>
    <p v-bind:class="statusClass">{{ statusText }}</p>
  </div>
</template>

<script>
export default {
  name: "button-card",
  props: ["tile"],
  data: function() {
    return {
      apiUrl: `/api/device/${this.tile.deviceId}/method/${
        this.tile.deviceMethod
      }`,
      statusText: "",
      statusClass: "status"
    };
  },
  methods: {
    onClick: function() {
      this.statusText = "calling device method...";

      const payloadExists =
        this.tile.deviceMethodPayload && this.tile.deviceMethodPayload.length;
      const body = payloadExists
        ? { devicePayload: this.tile.deviceMethodPayload }
        : {};
      const headers = {
        "Content-Type": "application/json"
      };

      fetch(this.apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      })
        .then(r => {
          if (r.ok) {
            this.statusText = "done!";
            this.statusClass = "status success";
          } else {
            this.statusText = "oops, that device method might not exist!";
            this.statusClass = "status error";
          }
        })
        .catch(error => (this.statusText = "something went wrong..."));
    }
  }
};
</script>
