<template>
  <div class=" z-30">
    <form @submit.prevent="handleSubmit">
      <!-- Name -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 z-50" for="name">Ism:</label>
        <input
          v-model="name"
          id="name"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Surname -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="surname"
          >Familiya:</label
        >
        <input
          v-model="surname"
          id="surname"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Subject -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="subject"
          >Fan:</label
        >
        <select
          v-model="subject"
          id="subject"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option v-for="subject in subjects" :key="subject.id" :value="subject.name">
            {{ subject.name }}
          </option>
        </select>
      </div>

      <!-- Teacher -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="teacher"
          >O'qituvchi:</label
        >
        <select
          v-model="teacher"
          id="teacher"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.name">
            {{ teacher.name }}
          </option>
        </select>
      </div>

      <!-- Date -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="date">Sana:</label>
        <input
          v-model="date"
          id="date"
          type="date"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Phone -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone"
          >Telefon:</label
        >
        <input
          v-model="phone"
          id="phone"
          type="tel"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Payment -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="payment"
          >To'lov:</label
        >
        <select
          v-model="payment"
          id="teacher"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option
            v-for="payment in payments"
            :key="payment.id"
            :value="payment.totalPayment"
          >
            {{ payment.totalPayment }}
          </option>
        </select>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Student Qo'shish
        </button>

        <button
          type="button"
          @click="$emit('close')"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Bekor Qilish
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default {
  data() {
    return {
      name: "",
      surname: "",
      subject: "",
      teacher: "",
      date: "",
      phone: "",
      payment: "", // Payment field added
      subjects: [], // List of subjects
      teachers: [], // List of teachers
      payments: [],
    };
  },
  async created() {
    await this.fetchSubjects();
    await this.fetchTeachers();
    await this.fetchPayments();
  },
  methods: {
    async fetchSubjects() {
      try {
        const subjectsCollection = collection(db, "subjects");
        const snapshot = await getDocs(subjectsCollection);
        this.subjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Fanlarni olishda xatolik:", error);
      }
    },
    async fetchPayments() {
      try {
        const paymentsCollection = collection(db, "payments");
        const snapshot = await getDocs(paymentsCollection);
        this.payments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("to'lov olishda xatolik:", error);
      }
    },
    async fetchTeachers() {
      try {
        const teachersCollection = collection(db, "teachers");
        const snapshot = await getDocs(teachersCollection);
        this.teachers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("O'qituvchilarni olishda xatolik:", error);
      }
    },
    async handleSubmit() {
      try {
        const studentsCollection = collection(db, "students");
        await addDoc(studentsCollection, {
          name: this.name,
          surname: this.surname,
          subject: this.subject,
          teacher: this.teacher,
          phone: this.phone,
          date: this.date,
          payment: this.payment,
        });
        this.$emit("close");
        Toastify({
          text: "Student muvaffaqiyatli qo'shildi!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
        // Clear form
        this.name = "";
        this.surname = "";
        this.subject = "";
        this.teacher = "";
        this.date = "";
        this.phone = "";
        this.payment = "";
      } catch (error) {
        console.error("Student qo'shishda xatolik:", error);
      }
    },
  },
};
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  --moz-appearance: textfield;
}
</style>
