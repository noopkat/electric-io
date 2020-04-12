<template>
  <div class="electric-toast">
    <div class="electric-toast__content">
      <slot />
    </div>

    <div class="electric-toast__actions">
      <button
        class="electric-toast__action-button"
        type="button"
        @click="dismissToast"
      >
        <span class="sr-only">Close toast</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="m2,0l4,4 4,-4 2,2 -4,4 4,4 -2,2 -4,-4 -4,4 -2,-2 4,-4 -4,-4 Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
const AUTO_DISMISS_TIMEOUT_IN_SECONDS = 5;

export default {
  name: "ElectricToast",

  props: {
    toastId: {
      type: String,
      required: true
    },

    shouldAutoDismiss: {
      type: Boolean,
      required: false,
      default: false
    },

    autoDismissTimeoutInSeconds: {
      type: Number,
      required: false,
      default: 5
    }
  },

  created() {
    if (this.shouldAutoDismiss) {
      setTimeout(() => {
        this.dismissToast();
      }, this.autoDismissTimeoutInSeconds * 1000);
    }
  },

  methods: {
    dismissToast() {
      this.$emit("electric-toaster:dismiss-toast", this.toastId);
    }
  }
};
</script>

<style scoped>
/*
1. The parent component sets “pointer-events: none”.
   We need to revert this here so that the toast elements can
   still be interacted with (e.g. text selection, etc.).
*/
.electric-toast {
  pointer-events: all; /* 1. */
  display: flex;
  align-items: stretch;
  border: 2px solid currentColor;
  border-radius: 6px;
  background-color: #fff;
}

.electric-toast__content {
  flex-grow: 1;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 5px;
}

.electric-toast__action-button {
  width: 30px;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.electric-toast__action-button:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.electric-toast__action-button:not(:disabled):hover {
  background-color: pink;
}

.electric-toast__action-button:not(:disabled):focus {
  outline: 2px dotted #000;
  outline-offset: -2px;
}
</style>
