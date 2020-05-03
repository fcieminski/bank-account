import Vue from "vue";
import VueRouter from "vue-router";
import authService from "../services/AuthService";
const Main = () => import("@/views/Main.vue");
const BankSignup = () => import("@/components/BankSignup.vue");
const BankLogin = () => import("@/components/BankLogin.vue");
const Account = () => import("@account/Account.vue");
const AccountInfo = () => import("@account/AccountInfo.vue");
const AccountTransfer = () => import('@account/AccountTransfer.vue')

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "main",
        component: Main,
        children: [
            {
                path: "/",
                name: "main.login",
                component: BankLogin,
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: "/signup",
                name: "main.signup",
                component: BankSignup,
                meta: {
                    requiresAuth: false
                }
            }
        ],
        meta: {
            requiresAuth: false
        }
    },

    {
        path: "/account",
        name: "account",
        component: Account,
        children: [
            {
                path: "/account",
                name: "account.start",
                component: AccountInfo,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: "transfer",
                name: "account.transfer",
                component: AccountTransfer,
                meta: {
                    requiresAuth: true
                }
            }
        ],
        meta: {
            requiresAuth: true
        }
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const user =
            localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
        authService.isAuth().then(response => {
            if (response.user.id === user.id) {
                next();
            } else {
                next({
                    name: "main"
                });
            }
        });
    } else {
        next();
    }
});

export default router;
