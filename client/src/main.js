import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/assets/styles/index.scss";
import axios from "axios";
import { ValidationProvider, ValidationObserver } from "vee-validate";

window.axios = axios;
axios.defaults.withCredentials = true;

Vue.config.productionTip = false;
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
