<template>
  <div class="dashboard-container bg-slate-200  h-full">
    <h1 class="text-3xl font-bold text-center py-5 animate__animated animate__bounce text-item">Home Page</h1>

    <div class="stats-container grid grid-cols-3 gap-4 my-4">
      <div class="stat-card w-full">
        <h2 class="text-lg font-semibold">O'quvchilar soni:</h2>
        <p class="text-2xl font-bold">{{ totalStudentsCount }} ta </p>
      </div>
      <div class="stat-card w-full">
        <h2 class="text-lg font-semibold">Jami to'lovlar:</h2>
        <p class="text-2xl font-bold">{{ totalPayments }} so'm</p>
      </div>
      <div 
        v-if="isAdmin" 
        class="stat-card w-full flex items-center justify-center cursor-pointer"
      >
        <router-link to="/teacher">
          <h2 class="text-lg font-semibold">Ustozlar soni:</h2>
          <p class="text-2xl font-bold">{{ totalTeachersCount }} ta</p>
        </router-link>
      </div>
    </div>

    <table class="min-w-full bg-white border rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th class="py-3 px-6 text-left">Ism</th>
          <th class="py-3 px-6 text-left">Familiya</th>
          <th class="py-3 px-6 text-left">Telefon</th>
          <th class="py-3 px-6 text-left">To'lov</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in students"
          :key="index"
          class="border-b border-gray-300"
        >
          <td class="py-3 px-6 capitalize">{{ student.name }}</td>
          <td class="py-3 px-6 capitalize">{{ student.surname }}</td>
          <td class="py-3 px-6">{{ student.phone }}</td>
          <td class="py-3 px-6">{{ student.payment }} so'm</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db, auth } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      students: [],
      teachers: [],
      currentTeacher: null,
      isAdmin: false, // Admin yoki ustoz ekanligini aniqlash uchun flag
    };
  },
  computed: {
    totalStudentsCount() {
      return this.students.length;
    },
    totalPayments() {
      return this.students.reduce((total, student) => total + student.payment, 0);
    },
    totalTeachersCount() {
      return this.teachers.length;
    },
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      // Admin bo'lsa
      if (user.email === "admin@gmail.com") {
        this.isAdmin = true; // Admin ekanligini belgilash
        const studentSnapshot = await getDocs(collection(db, "students"));
        this.students = studentSnapshot.docs.map((doc) => doc.data());

        const teacherSnapshot = await getDocs(collection(db, "teachers"));
        this.teachers = teacherSnapshot.docs.map((doc) => doc.data());
      } else {
        this.isAdmin = false; // Admin emasligini belgilash
        // Ustoz foydalanuvchi bo'lsa, faqat o'zining o'quvchilarini ko'rsatamiz
        const teacherQuery = query(
          collection(db, "teachers"),
          where("email", "==", user.email)
        );
        const teacherSnapshot = await getDocs(teacherQuery);
        teacherSnapshot.forEach((doc) => {
          this.currentTeacher = doc.data();
        });

        const studentQuery = query(
          collection(db, "students"),
          where("teacher", "==", this.currentTeacher?.name)
        );
        const studentSnapshot = await getDocs(studentQuery);
        this.students = studentSnapshot.docs.map((doc) => doc.data());
      }
    }
  },
};
</script>

<style scoped>
.text-item{
  -webkit-text-stroke: 0.8px blue;
  font-weight: 900;
}

.dashboard-container {
  padding: 20px;
}

.stats-container {
  display: flex;
  justify-content: space-between;
}

.stat-card {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}

.table-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
