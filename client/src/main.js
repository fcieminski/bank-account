import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/assets/styles/index.scss";
import axios from "axios";
import LoadingIndicator from "@utils/LoadingIndicator";
import InputError from "@utils/InputError.vue";
import DialogModal from "@utils/DialogModal.vue";
import { pl } from "date-fns/locale";
import {ValidationProvider, ValidationObserver } from './veeValidate'

window.axios = axios;
axios.defaults.withCredentials = true;

Vue.config.productionTip = false;
Vue.prototype.$localePl = pl;
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("loading-indicator", LoadingIndicator);
Vue.component("input-error", InputError);
Vue.component("dialog-modal", DialogModal);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
