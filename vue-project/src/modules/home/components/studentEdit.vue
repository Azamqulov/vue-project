<template>
  <div
    v-if="showEditModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <span class="float-right cursor-pointer text-xl" @click="closeEditModal"
        >&times;</span
      >
      <h2 class="text-2xl font-bold mb-4">Talabani tahrirlash</h2>
      <form @submit.prevent="updateStudent">
        <div class="mb-4">
          <label for="surname" class="block text-sm font-bold mb-2">Familiya:</label>
          <input
            type="text"
            v-model="editForm.surname"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="name" class="block text-sm font-bold mb-2">Ism:</label>
          <input
            type="text"
            v-model="editForm.name"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="subject" class="block text-sm font-bold mb-2">Fan:</label>
          <select v-model="editForm.subject" class="w-full p-2 border rounded" required>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.name">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="teacher" class="block text-sm font-bold mb-2">O'qituvchi:</label>
          <select v-model="editForm.teacher" class="w-full p-2 border rounded" required>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.name">
              {{ teacher.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="date" class="block text-sm font-bold mb-2">Sana:</label>
          <input
            type="date"
            v-model="editForm.date"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-bold mb-2">Telefon:</label>
          <input
            type="tel"
            v-model="editForm.phone"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="payment" class="block text-sm font-bold mb-2">To'lov:</label>
          <select v-model="editForm.payment" class="w-full p-2 border rounded" required>
            <option
              v-for="payment in payments"
              :key="payment.id"
              :value="payment.totalPayment"
            >
              {{ payment.totalPayment }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
        >
          Saqlash
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import Toastify from "toastify-js";

export default {
  props: {
    showEditModal: {
      type: Boolean,
      required: true,
    },
    student: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editForm: {
        id: this.student.id,
        surname: this.student.surname,
        name: this.student.name,
        subject: this.student.subject,
        teacher: this.student.teacher,
        date: this.student.date,
        phone: this.student.phone,
        payment: this.student.payment,
      },
      subjects: [],
      teachers: [],
      payments: [],
    };
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
    },
    async updateStudent() {
      try {
        const studentRef = doc(db, "students", this.editForm.id);
        await updateDoc(studentRef, {
          surname: this.editForm.surname,
          name: this.editForm.name,
          subject: this.editForm.subject,
          teacher: this.editForm.teacher,
          date: this.editForm.date,
          phone: this.editForm.phone,
          payment: this.editForm.payment,
        });
        this.closeEditModal();
        Toastify({
          text: "Talaba muvaffaqiyatli tahrirlandi!",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          duration: 3000,
        }).showToast();
        this.$emit("updated");
      } catch (error) {
        console.error("Talaba tahrirlanmadi:", error);
        alert("Talaba tahrirlanmadi: " + error.message);
      }
    },
    async fetchSubjectsAndTeachers() {
      const subjectsSnapshot = await getDocs(collection(db, "subjects"));
      const teachersSnapshot = await getDocs(collection(db, "teachers"));
      const paymentsSnapshot = await getDocs(collection(db, "payments"));

      this.subjects = subjectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.teachers = teachersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.payments = paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  },
  mounted() {
    this.fetchSubjectsAndTeachers();
  },
};
</script>

<style scoped>
/* Tailwind CSS orqali ishlab chiqilgan uslublar */
</style>
