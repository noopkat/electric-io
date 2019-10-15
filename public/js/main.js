import Vue from "vue";
import App from "./components/App";
import VueA11yDialog from "vue-a11y-dialog";
import "chartist/dist/chartist.min.css";

Vue.use(VueA11yDialog);

new Vue({
  el: "#app",

  render: h => h(App)
});
