<template>
  <div>
    <button class="action-button" @click="onClick">
      {{ tile.buttonText }}
    </button>
    <p :class="statusClass">
      {{ statusText }}
    </p>
  </div>
</template>

<script>
export default {
  name: "ButtonCard",

  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      apiUrlBase: `/api/device/${this.tile.deviceId}`,
      statusText: "",
      statusClass: "status"
    };
  },

  methods: {
    onClick() {
      this.statusText = "calling device method...";

      const apiUrl = `${this.apiUrlBase}${
        this.tile.callType === "method"
          ? `/method/${this.tile.deviceMethod}`
          : "/message/"
      }`;

      const payloadExists =
        this.tile.callPayload && this.tile.callPayload.length;
      const body = payloadExists ? { callPayload: this.tile.callPayload } : {};
      const headers = {
        "Content-Type": "application/json"
      };

      fetch(apiUrl, {
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
