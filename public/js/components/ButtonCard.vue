<template>
  <div>
    <button class="thick-button" type="button" @click="onClick">
      {{ tile.buttonText }}
    </button>

    <p v-if="statusText" class="button-card-status" :class="statusClass">
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
      statusText: "",
      statusClass: ""
    };
  },

  methods: {
    async onClick() {
      this.statusText = "Calling device method …";

      const apiUrl = `/api/device/${this.tile.deviceId}${
        this.tile.callType === "method"
          ? `/method/${this.tile.deviceMethod}`
          : "/message/"
      }`;
      const payloadExists =
        this.tile.callPayload && this.tile.callPayload.length > 0;
      const jsonPayload = payloadExists
        ? { callPayload: this.tile.callPayload }
        : {};

      const fetchInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonPayload)
      };

      try {
        const response = await fetch(apiUrl, fetchInit);

        if (response.ok) {
          this.statusText = "Done!";
          this.statusClass = "success";
        } else {
          this.statusText = "Oops, that device method might not exist!";
          this.statusClass = "error";
        }
      } catch (error) {
        this.statusText = "Something went wrong …";
        this.statusClass = "error";
      }
    }
  }
};
</script>

<style scoped>
.button-card-status {
  position: relative;
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 12px;
}

.button-card-status.error {
  color: #da2727;
}

.button-card-status.success {
  color: #048401;
}
</style>
