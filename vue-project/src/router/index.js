import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebaseConfig"; // Firebase autentifikatsiyasi

import homeVue from "../modules/home/views/home.vue";
const teacher = () => import("../modules/home/views/teacher.vue");
const students = () => import("../modules/home/views/students.vue");
const lessons = () => import("../modules/home/views/pyments.vue");
const dashbard = () => import("../modules/home/views/dashbard.vue");
const login = () => import("../modules/auth/views/Login.vue");
const signup = () => import("@/modules/auth/views/Signup.vue");

// 404 sahifasi
import page404 from "../views/404.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: homeVue,
    },
    {
      path: "/teacher",
      name: "teacher",
      component: teacher,
      meta: { requiresAuth: true },
    },
    {
      path: "/students",
      name: "students",
      component: students,
      meta: { requiresAuth: true },
    },
    {
      path: "/pyments",
      name: "lessons",
      component: lessons,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashbard",
      name: "dashbard",
      component: dashbard,
      meta: { requiresAuth: true },
    },

    // 404 sahifasi
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: page404,
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/signup",
      name: "signup",
      component: signup,
    },
  ],
});

// Har bir marshrutga o'tishdan oldin autentifikatsiyani tekshiramiz
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser; // Foydalanuvchi tizimga kirganmi yoki yo'qmi

  // Agar foydalanuvchi tizimga kirmagan bo'lsa va sahifa autentifikatsiya talab qilsa

  // Agar foydalanuvchi tizimga kirgan bo'lsa va login sahifasiga kirmoqchi bo'lsa
 if (to.name === "login" && isAuthenticated) {
    next("/"); // Bosh sahifaga yo'naltiramiz
  }
  // Admin yo'naltirishini tekshirish
  else if (
    to.name === "teacher" &&
    isAuthenticated &&
    auth.currentUser.email !== "admin@gmail.com"
  ) {
    next("/"); // Admin bo'lmagan foydalanuvchini uy sahifasiga yo'naltiramiz
  } else {
    next(); // Aks holda, so'ralgan sahifaga yo'naltiramiz
  }
});

export default router;
