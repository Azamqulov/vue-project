<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-4">Yangi O'qituvchi Qo'shish</h2>
      <form @submit.prevent="addTeacher">
        <div class="mb-4">
          <label for="name" class="block text-lg font-medium mb-2">Ism</label>
          <input
            v-model="name"
            type="text"
            id="name"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="surname" class="block text-lg font-medium mb-2">Familiya</label>
          <input
            v-model="surname"
            type="text"
            id="surname"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="subject" class="block text-lg font-medium mb-2">Fan</label>
          <input
            v-model="subject"
            type="text"
            id="subject"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-lg font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-lg font-medium mb-2">Parol</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600"
            @click="closeModal"
          >
            Bekor Qilish
          </button>
          <button
            type="submit"
            class="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Qo'shish
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/firebaseConfig"; // Firebase konfiguratsiyasi
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; // Toastify uslublari

export default {
  props: {
    show: Boolean,
  },
  data() {
    return {
      name: "",
      surname: "",
      subject: "",
      email: "",
      password: "", // Parol ma'lumotlari
    };
  },
  methods: {
    closeModal() {
    this.$emit("close"); // Bu metod modalni yopish uchun signalni (emit) beradi
  },
    async addTeacher() {
      try {
        // Email manzilining mavjudligini tekshirish
        const existingUsers = await getDocs(query(collection(db, "users"), where("email", "==", this.email)));

        if (!existingUsers.empty) {
          Toastify({
            text: "Ushbu email manzili allaqachon ro'yxatdan o'tgan.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
          return; // Email mavjud bo'lsa, qo'shishni to'xtatish
        }

        // Firebase Authentication'da foydalanuvchini yaratish
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

        // Foydalanuvchi ID (UID) ni olish
        const uid = userCredential.user.uid;

        // O'qituvchi ma'lumotlarini Firestore'ga qo'shish
        await addDoc(collection(db, "teachers"), {
          uid: uid,
          name: this.name,
          surname: this.surname,
          subject: this.subject,
          email: this.email,
        });

        // Fanlarni subjects kolleksiyasiga qo'shish
        await addDoc(collection(db, "subjects"), {
          name: this.subject,
          teacherId: uid,
        });

        // Foydalanuvchini users kolleksiyasiga qo'shish
        await addDoc(collection(db, "users"), {
          uid: uid,
          email: this.email,
          firstName:this.name,
          lastName:this.surname,
          role: "teacher",
        });

        // Muvaffaqiyatli qo'shilsa, xabar berish
        Toastify({
          text: "O'qituvchi muvaffaqiyatli qo'shildi!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
        
        this.closeModal(); // Modalni yopish
      } catch (error) {
        // Xato holatlari
        console.error("O'qituvchini qo'shishda xato:", error.message);
        Toastify({
          text: "O'qituvchini qo'shishda xato: " + error.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    },
  },
};
</script>
