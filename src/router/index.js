import BrainAwareness from "@/components/custom-components/brainAwareness.vue";
import ConcussionVisulization from "@/components/custom-components/ConcussionVisulization.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: "/", name: "Home", component: BrainAwareness, meta: { title: "Home" } }],
});

export default router;
