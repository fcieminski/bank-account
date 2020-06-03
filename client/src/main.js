import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/assets/styles/index.scss";
import axios from "axios";
import {
  ValidationProvider,
  ValidationObserver
} from "vee-validate/dist/vee-validate.full";
import LoadingIndicator from "@utils/LoadingIndicator";
import InputError from "@utils/InputError.vue";

window.axios = axios;
axios.defaults.withCredentials = true;

Vue.config.productionTip = false;
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("loading-indicator", LoadingIndicator);
Vue.component("input-error", InputError);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
