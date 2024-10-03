<template>
  <div class="home-container">
    <h1 class="text-3xl font-bold text-center py-5 text-item">O'qituvchining Sahifasi</h1>

    <div v-if="user">
      <!-- Foydalanuvchi ma'lumotlari -->
      <div class="user-info flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          <span class="font-bold">Foydalanuvchi:</span> {{ user.email }}
        </h2>
        <router-link to="/login">
          <button class="bg-red-700 py-1 px-5 text-white font-bold" @click="logout">
            Chiqish <i class="fa-solid fa-right-from-bracket"></i></button
        ></router-link>
      </div>

      <!-- Foydalanuvchining o'quvchilari statistikasi -->
      <div class="stats-container grid grid-cols-3 gap-4 my-4">
        <div class="stat-card w-full bg-blue-100 text-blue-800 shadow-lg">
          <h2 class="text-lg font-semibold">Jami O'quvchilar:</h2>
          <p class="text-2xl font-bold">{{ totalStudentsCount }}</p>
        </div>

        <div class="stat-card w-full bg-green-100 text-green-800 shadow-lg">
          <h2 class="text-lg font-semibold">Jami To'lovlar:</h2>
          <p class="text-2xl font-bold">{{ totalPayments }} so'm</p>
        </div>

        <div class="stat-card w-full bg-yellow-100 text-yellow-800 shadow-lg">
          <h2 class="text-lg font-semibold">Oylik Foyda:</h2>
          <p class="text-2xl font-bold">{{ monthlyProfit }} so'm</p>
        </div>
      </div>
      <!-- Guruhlar ro'yxati va o'quvchilarni guruhga qo'shish -->
      <div class="grouplist-container">
        <hr />
        <hr />
        <hr />
        <GroupManagement></GroupManagement>
      </div>
      <hr />
      <hr />
      <hr />
      <!-- Diagramma -->
      <canvas id="studentChart" width="400" height="200" class="my-5"> </canvas>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Chart from "chart.js/auto"; // Chart.js kutubxonasi
import GroupManagement from "../components/GroupManagement.vue";

export default {
  components: {
    GroupManagement, // Guruhlar komponentini qo'shish
  },
  data() {
    return {
      user: null,
      students: [],
      teacherName: null, // O'qituvchi ismi
    };
  },
  computed: {
    totalStudentsCount() {
      return this.students.length; // Jami o'quvchilar soni
    },
    totalPayments() {
      return this.students.reduce((total, student) => total + student.payment, 0); // Jami to'lovlar
    },
    monthlyProfit() {
      // Oylik foyda (foydani hisoblash formulasi aniq emas, taxminiy)
      return this.students.reduce((total, student) => total + student.payment * 0.7, 0); // taxminiy 70% foyda
    },
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        if (user.email === "admin@gmail.com") {
          await this.fetchAllStudents(); // Barcha o'quvchilarni olish
        } else {
          await this.fetchTeacherName(user.email); // O'qituvchi nomini olish
          await this.fetchStudents(this.teacherName); // O'quvchilarni olish
        }
        this.createChart(); // Diagrammani yaratish
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    async fetchTeacherName(teacherEmail) {
      // Teachers kolleksiyasidan o'qituvchi nomini olish
      const teacherRef = collection(db, "teachers");
      const q = query(teacherRef, where("email", "==", teacherEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        this.teacherName = querySnapshot.docs[0].data().name; // O'qituvchi nomini saqlash
      }
    },
    async fetchStudents(teacherName) {
      // O'quvchilarni teacherName orqali olish
      const studentsRef = collection(db, "students");
      const q = query(studentsRef, where("teacher", "==", teacherName)); // "teacher" maydoniga muvofiq
      const querySnapshot = await getDocs(q);
      this.students = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // O'quvchilarni olish
    },
    async fetchAllStudents() {
      // Barcha o'quvchilarni olish
      const studentsRef = collection(db, "students");
      const querySnapshot = await getDocs(studentsRef);
      this.students = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // O'quvchilarni olish
    },

    createChart() {
      // Diagramma uchun ma'lumotlar tayyorlash
      const studentNames = this.students.map((student) => student.name);
      const studentPayments = this.students.map((student) => student.payment);

      // Chart.js diagrammasini yaratish
      const ctx = document.getElementById("studentChart").getContext("2d");
      new Chart(ctx, {
        type: "bar", // Bar diagramma
        data: {
          labels: studentNames,
          datasets: [
            {
              label: "To'lovlar (so'm)",
              data: studentPayments,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.text-item {
  -webkit-text-stroke: 0.8px blue;
  font-weight: 900;
}

.home-container {
  padding: 20px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.students-list {
  margin-top: 40px;
}

.students-list ul {
  list-style-type: none;
  padding: 0;
}

.grouplist-container {
  margin-top: 30px;
}
</style>
