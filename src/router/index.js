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
    },
    {
      path: "/borrowing",
      component: () => import("../views/Borrowing.vue"),
    },
  ],
});

export default router;
