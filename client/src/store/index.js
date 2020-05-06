import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    account: null
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    }
  },
  actions: {
    setUser({ commit }, data) {
      commit("setUser", data);
    }
  },
  modules: {}
});
