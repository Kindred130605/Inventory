import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
      beforeEnter: (to, from, next) => {
        if (store.getters.isLoggedIn) {
          next('/dashboard');
        } else {
          next();
        }
      }
    },
    {
      path: "/login",
      component: () => import("../views/AdminLogin.vue"),
      beforeEnter: (to, from, next) => {
        if (store.getters.isLoggedIn) {
          next('/dashboard');
        } else {
          next();
        }
      }
    },
    {
      path: "/dashboard",
      component: () => import("../views/Dashboard.vue"),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isLoggedIn) {
          next('/login');
        } else {
          next();
        }
      }
    },
    {
      path: "/damaged",
      component: () => import("../views/DamagedItems.vue"),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isLoggedIn) {
          next('/login');
        } else {
          next();
        }
      }
    },
    {
      path: "/unusable",
      component: () => import("../views/UnusableItems.vue"),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isLoggedIn) {
          next('/login');
        } else {
          next();
        }
      }
    },
    {
      path: "/items",
      component: () => import("../views/Items.vue"),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isLoggedIn) {
          next('/login');
        } else {
          next();
        }
      }
    },
    {
      path: "/borrowing",
      component: () => import("../views/Borrowing.vue"),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isLoggedIn) {
          next('/login');
        } else {
          next();
        }
      }
    },
    
  ],
});

export default router;
