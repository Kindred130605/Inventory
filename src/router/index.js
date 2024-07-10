import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "login",
    },
    {
      path: "/login",
      component: () => import("../views/AdminLogin.vue"),
    },
    {
      path: "/dashboard",
      component: () => import("../views/Dashboard.vue"),
    },
    {
      path: "/junior",
      component: () => import("../views/Junior.vue"),
    },
    {
      path: "/senior",
      component: () => import("../views/Senior.vue"),
    },
    {
      path: "/rooms",
      component: () => import("../views/Room.vue"),
    },
    {
      path: "/items",
      component: () => import("../views/Items.vue"),
    },
    {
      path: "/pendingitems",
      component: () => import("../views/PendingItems.vue"),
    },
    {
      path: "/itemrecords",
      component: () => import("../views/ItemsRecords.vue"),
    }
  ],
});

export default router;
