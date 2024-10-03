<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex justify-center items-center bg-orange-100"
  >
    <div class="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg relative">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

      <form @submit.prevent="login" class="flex flex-col gap-6">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="p-3 border-2 border-solid border-gray-300 outline-none w-full rounded-md"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="p-3 border-2 border-gray-300 outline-none w-full rounded-md border-solid"
        />
        <button
          type="submit"
          class="bg-blue-600 py-3 rounded-md text-white font-bold w-full hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <button @click="closeModal" class="absolute top-2 right-2 text-gray-600">X</button>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Toastify from "toastify-js";

export default {
  data() {
    return {
      email: "",
      password: "",
      showModal: true,
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.closeModal(); // Modalni yopamiz

        // Yangi hodisani chaqiramiz
        this.$emit('login-success'); // Tizimga kirish muvaffaqiyatli bo'lsa, hodisa chaqiramiz

        Toastify({
          text: "Login muvaffaqiyatli!",
          backgroundColor: "green",
          className: "info",
          position: "right",
          duration: 3000,
        }).showToast();

        this.$router.push("/teacher");
      } catch (error) {
        Toastify({
          text: "Login muvaffaqiyatsiz: " + error.message,
          backgroundColor: "red",
          className: "error",
          position: "right",
          duration: 3000,
        }).showToast();
      }
    },
    closeModal() {
      this.showModal = false; // Modalni yopish funksiyasi
    },
  },
};
</script>

<style scoped>
/* Modal uslublarini qo'shishingiz mumkin */
</style>
