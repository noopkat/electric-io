<template>
  <div class="electric-toaster">
    <div class="electric-toaster__toast-list">
      <ElectricToast
        v-for="toast in activeToasts"
        :key="toast.id"
        :toast-id="toast.id"
        :should-auto-dismiss="toast.shouldAutoDismiss"
        :auto-dismiss-timeout-in-seconds="toast.autoDismissTimeoutInSeconds"
        @electric-toaster:dismiss-toast="dismissToast"
      >
        {{ toast.content }}
      </ElectricToast>
    </div>

    <div
      class="electric-toaster__live-region sr-only"
      role="region"
      aria-live="polite"
    >
      <h2>Toast notifications</h2>

      <p
        v-for="toast in activeToasts"
        :key="toast.id"
      >
        {{ toast.content }}
      </p>
    </div>
  </div>
</template>

<script>
import ElectricToast from "./ElectricToast.vue";

const DEFAULT_SHOULD_AUTO_DISMISS = false;
const DEFAULT_AUTO_DISMISS_TIMEOUT_IN_SECONDS = 10;
const REQUIRED_TOAST_PROPERTIES = ["id", "content"];

export default {
  name: "ElectricToaster",

  components: {
    ElectricToast
  },

  props: {
    toasts: {
      type: Array,
      required: true,
      validator(toasts) {
        return toasts.every(toast =>
          REQUIRED_TOAST_PROPERTIES.every(prop => prop in toast)
        );
      }
    }
  },

  data() {
    return {
      dismissedToastIds: []
    };
  },

  computed: {
    activeToasts() {
      return this.toasts
        .filter(toast => !this.dismissedToastIds.includes(toast.id))
        .map(toast => {
          if (!("shouldAutoDismiss" in toast)) {
            toast.shouldAutoDismiss = DEFAULT_SHOULD_AUTO_DISMISS;
          }

          if (
            toast.shouldAutoDismiss &&
            !("autoDismissTimeoutInSeconds" in toast)
          ) {
            toast.autoDismissTimeoutInSeconds = DEFAULT_AUTO_DISMISS_TIMEOUT_IN_SECONDS;
          }

          return toast;
        });
    }
  },

  methods: {
    dismissToast(toastId) {
      if (!this.dismissedToastIds.includes(toastId)) {
        this.dismissedToastIds.push(toastId);
      }
    }
  }
};
</script>

<style scoped>
/*
1. Makes sure that elements under and between the toast elements remain interactive.
*/
.electric-toaster {
  pointer-events: none; /* 1. */
  position: fixed;
  z-index: 3000;
  bottom: 0;
  left: 0;
  padding-bottom: 15px;
  padding-left: 15px;
}

.electric-toaster__toast-list > :not(:first-child) {
  margin-top: 15px;
}
</style>
