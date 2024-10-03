<template>
  <div class="p-4 bg-slate-100 h-screen">
   <div class="title-text flex justify-between items-center mb-10 ">
    <h1 class="text-3xl font-bold text-center py-5 text-item">O'quvchilar Ro'yxati</h1>

    <!-- Excelga eksport qilish tugmasi -->
    <button
      @click="exportToExcel"
      class=" h-1/2 bg-blue-500 text-white p-2 rounded mb-4 font-bold"
    >
    <i class="fa-solid fa-download"></i> <span>Excel Faylga Yuklash</span> 
    </button>
   </div>


    <!-- O'quvchilar ro'yxati -->
    <table v-if="!loading && filteredStudents.length > 0" class="w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th class="border border-gray-300 p-2">№</th>
          <th class="border border-gray-300 p-2">F.I.SH</th>
          <th
            v-for="(month, index) in months"
            :key="index"
            class="border border-gray-300 p-2"
          >
            {{ month }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in paginatedStudents" :key="student.id">
          <td class="border border-gray-300 p-2 text-center font-extrabold">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </td>
          <td class="border border-gray-300 p-2 w-3/12 capitalize" >
            {{ student.name }} {{ student.surname }}
          </td>
          <td
            v-for="(month, monthIndex) in months"
            :key="monthIndex"
            class="border border-gray-300 text-center w-1/12"
          >
            <input
              class="w-5 h-5 p-0"
              type="checkbox"
              :checked="isPaid(student.id, monthIndex)"
              @change="updatePayment(student.id, monthIndex, $event.target.checked)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Agar o'quvchilar yo'q bo'lsa -->
    <div v-if="!loading && filteredStudents.length === 0" class="text-center py-10">
      <p>O'quvchilar topilmadi</p>
    </div>

    <!-- Paginatsiya -->
    <footer v-if="totalPages > 1" class="mt-4">
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="prevPage"
        @next="nextPage"
      />
    </footer>
  </div>
</template>

<script>
import { db, auth } from "@/firebaseConfig";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import Pagination from "../components/pagination.vue";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      students: [],
      currentTeacher: null,
      months: [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
      ],
      currentPage: 1,
      itemsPerPage: 20,
      loading: true,
      isAdmin: false,
    };
  },
  computed: {
    paginatedStudents() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredStudents.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    },
    filteredStudents() {
      if (this.isAdmin) {
        return this.students; // Admin sees all students
      } else if (this.currentTeacher) {
        return this.students.filter(student => student.teacher === this.currentTeacher.name);
      }
      return [];
    },
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      if (user.email === "admin@gmail.com") {
        this.isAdmin = true;
        await this.fetchAllStudents();
      } else {
        this.isAdmin = false;
        await this.fetchTeacher();
        await this.fetchTeacherStudents();
      }
    }
  },
  methods: {
    async fetchAllStudents() {
      try {
        const studentSnapshot = await getDocs(collection(db, "students"));
        this.students = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.loading = false;
      } catch (error) {
        console.error("O'quvchilarni yuklashda xato:", error);
        alert("O'quvchilarni yuklashda xato: " + error.message);
        this.loading = false;
      }
    },
    async fetchTeacher() {
      try {
        const teacherQuery = query(
          collection(db, "teachers"),
          where("email", "==", auth.currentUser.email)
        );
        const teacherSnapshot = await getDocs(teacherQuery);
        if (!teacherSnapshot.empty) {
          this.currentTeacher = teacherSnapshot.docs[0].data();
        } else {
          console.log("Bu foydalanuvchi uchun o'qituvchi topilmadi.");
        }
      } catch (error) {
        console.error("O'qituvchini yuklashda xato:", error);
      }
    },
    async fetchTeacherStudents() {
      if (this.currentTeacher) {
        const studentQuery = query(
          collection(db, "students"),
          where("teacher", "==", this.currentTeacher.name)
        );
        const studentSnapshot = await getDocs(studentQuery);
        this.students = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.loading = false;
      }
    },
    isPaid(studentId, monthIndex) {
      const student = this.students.find(s => s.id === studentId);
      return student && student.payments ? student.payments[monthIndex] === true : false;
    },
    async updatePayment(studentId, monthIndex, isPaid) {
      try {
        const studentRef = doc(db, "students", studentId);
        const student = this.students.find(s => s.id === studentId);
        let payments = student.payments || Array(12).fill(false);
        payments[monthIndex] = isPaid;
        await updateDoc(studentRef, {
          payments,
        });
      } catch (error) {
        console.error("To'lov holatini yangilashda xato:", error);
        alert("To'lov holatini yangilashda xato: " + error.message);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    exportToExcel() {
      const data = this.filteredStudents.map(student => {
        const payments = student.payments || [];
        const paidStatus = this.months.map((month, index) =>
          payments[index] ? "+" : "-"
        );
        return {
          FISH: `${student.name} ${student.surname}`,
          ...Object.fromEntries(this.months.map((month, i) => [month, paidStatus[i]])),
        };
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "O'quvchilar");
      XLSX.writeFile(wb, "O'quvchilar_Ro'yxati.xlsx");
    },
  },
};
</script>

<style scoped>
/* Stil qo'shishingiz mumkin */
.text-item{
  -webkit-text-stroke: 0.8px blue;
  font-weight: 900;
}

</style>
