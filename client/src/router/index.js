import Vue from "vue";
import VueRouter from "vue-router";
const Main = () => import("@/views/Main.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "main",
    component: Main
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
