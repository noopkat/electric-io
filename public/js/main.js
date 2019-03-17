import Vue from "vue";
import App from "./components/App";
import VueA11yDialog from "vue-a11y-dialog";

Vue.use(VueA11yDialog);

const vm = new Vue({
  el: "#app",
  render: h => h(App)
});
