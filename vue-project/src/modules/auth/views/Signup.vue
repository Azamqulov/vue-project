<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
    <div
      class="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg relative"
    >
      <span
        class="absolute top-4 right-4 text-gray-500 cursor-pointer"
        @click="closeModal"
        >&times;</span
      >
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Ro'yxatdan o'tish</h2>

      <form @submit.prevent="register" class="flex flex-col gap-6">
        <input
          v-model="firstName"
          type="text"
          placeholder="Ism"
          required
          class="p-3 border-2 border-gray-300 outline-none w-full rounded-md border-solid"
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Familiya"
          required
          class="p-3 border-2 border-gray-300 outline-none w-full rounded-md border-solid"
        />
        <input
          v-model="phoneNumber"
          type="text"
          placeholder="Telefon raqam"
          required
          class="p-3 border-2 border-gray-300 outline-none w-full rounded-md border-solid"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="p-3 border-2 border-gray-300 outline-none w-full rounded-md border-solid"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Parol"
          required
          class="p-3 border-2 border-gray-300 outline-none w-full rounded-md border-solid"
        />
        <button
          type="submit"
          class="bg-blue-600 py-3 rounded-md text-white font-bold w-full hover:bg-blue-700"
        >
          Ro'yxatdan o'tish
        </button>
        <p class="text-center">
          Accountingiz bormi?
          <router-link to="/login" class="text-blue-600 hover:underline">
            Kirish
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      showModal: true, // Modal ochiq bo'lib ko'rinishi uchun
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${this.firstName} ${this.lastName}`,
        });

        await addDoc(collection(db, "users"), {
          uid: user.uid,
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          email: this.email,
          createdAt: new Date(),
        });

        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Ro'yxatdan o'tishda xatolik: ", error.message);
      }
    },
    closeModal() {
      this.showModal = false; // Modalni yopish funksiyasi
    },
  },
};
</script>

<style scoped>
/* Modal oynani butun ekranni egallash uchun */
</style>
