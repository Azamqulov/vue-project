<template>
  <div class="bg-slate-100 p-5 h-full">
    <!-- Title va Add Student tugmasi -->
    <div class="title_text flex justify-between p-5">
      <h1 class="text-3xl font-bold text-center py-5 animate__animated animate__bounce text-item">
        Students
      </h1>
      <div class="flex space-x-4">
        <!-- Add Student Tugmasi (Faqat adminlar uchun ko'rinadi) -->
        <button
      
          @click="openAddModal"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mb-4"
        >
          Add Student
        </button>
        <!-- Excelga eksport qilish tugmasi -->
        <button @click="exportToExcel" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded mb-4">
          Export to Excel
        </button>
      </div>
    </div>

    <!-- Filtrlar -->
    <div   v-if="isAdmin" class="filters flex space-x-4 mb-4">
      <input
        v-model="filters.name"
        type="text"
        placeholder="Search by name"
        class="w-1/3 p-2 border border-gray-300 rounded"
      />
      <select v-model="filters.teacher" class="w-1/3 p-2 border border-gray-300 rounded">
        <option value="">All Teachers</option>
        <option v-for="teacher in teachers" :key="teacher" :value="teacher">
          {{ teacher }}
        </option>
      </select>
      <select v-model="filters.subject" class="w-1/3 p-2 border border-gray-300 rounded">
        <option value="">All Subjects</option>
        <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
      </select>
      
    </div>
    <!-- Studentlar jadvali -->
    <table class="min-w-full bg-white overflow-hidden border rounded-lg border-gray-300">
      <thead>
        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th class="py-3 px-6 text-center font-bold">№</th>
          <th class="py-3 px-6">Name</th>
          <th class="py-3 px-6">Phone</th>
          <th class="py-3 px-6">Date</th>
          <th class="py-3 px-6 text-center">Teacher</th>
          <th class="py-3 px-6 text-center">Subject</th>
          <th class="py-3 px-6 text-center">Payments</th>
          <th class="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in filteredStudents" :key="student.id" class="border-b">
          <td class="py-3 px-6 text-center">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </td>
          <td class="py-3 px-6 capitalize">{{ student.name }} {{ student.surname }}</td>
          <td class="py-3 px-6">{{ student.phone }}</td>
          <td class="py-3 px-6">{{ student.date }}</td>
          <td class="py-3 px-6 text-center capitalize">{{ student.teacher }}</td>
          <td class="py-3 px-6 text-center capitalize">{{ student.subject }}</td>
          <td class="py-3 px-6 text-center">{{ student.payment }}</td>
          <td class="py-3 px-6 text-center gap-2">
               <button @click="openEditModal(student)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button @click="deleteStudent(student.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 mx-3 px-4 rounded">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <pagination :currentPage="currentPage" :totalPages="totalPages" @prev="prevPage" @next="nextPage" />
    <!-- Statistikalar -->
    <div class="stats p-5">
      <p class="text-xl font-semibold">O'quvchilar sonin: <span class="font-bold">{{ totalStudentsCount }} ta</span></p>
      <p class="text-xl font-semibold">Jammi to'lov: <span class="font-bold">{{ totalPayments }} so'm</span></p>
    </div>

    <!-- Student qo'shish / tahrirlash modal -->
 <!-- Add/Edit Student Modal -->
 <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
  <div class="bg-white p-5 rounded-lg shadow-lg w-96">
    <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
    <form @submit.prevent="saveStudent">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          v-model="studentForm.name"
          class="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Surname</label>
        <input
          type="text"
          v-model="studentForm.surname"
          class="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Phone</label>
        <input
          type="text"
          v-model="studentForm.phone"
          class="w-full p-2 border border-gray-300 rounded"
          required  maxlength="9" minlength="9"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Date</label>
        <input
          type="date"
          v-model="studentForm.date"
          class="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Teacher</label>
        <select v-model="studentForm.teacher" class="w-1/3 p-2 border border-gray-300 rounded w-full">

          <option v-for="teacher in teachers" :key="teacher" >
            {{ teacher }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Subject</label>

        <select v-model="studentForm.subject"  class="w-1/3 p-2 border border-gray-300 rounded w-full">
          <option  v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Payments</label>
        <input
          type="number"
          v-model="studentForm.payment"
          class="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          @click="closeModal"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>
<div v-if="showModal" class="fixed inset-0 bg-black opacity-50 z-40"></div>
  </div>
</template>
<script>
import * as XLSX from "xlsx"; // Excel eksport qilish uchun kutubxona
import { db, auth } from "@/firebaseConfig"; // Firebase config
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import pagination from "../components/pagination.vue"; // Pagination komponenti

export default {
  components: { pagination },
  data() {
    return {
      students: [],
      teachers: [],
      subjects: [],
      currentUser: "",
      filters: {
        name: "",
        teacher: "",
        subject: "",
      },
      isAdmin: false,
      showModal: false,
      modalType: "add",
      studentForm: {
        name: "",
        surname: "",
        phone: "",
        date: "",
        teacher: "",
        subject: "",
        payment: "",
      },
      selectedStudentId: null,
      currentPage: 1,
      itemsPerPage: 20,
    };
  },

  computed: {
    paginatedStudents() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredStudents.slice(startIndex, endIndex); // Faqat filterlanganlarni qaytaradi
    },
    filteredStudents() {
      return this.students.filter((student) => {
        const matchesName =
          student.name.toLowerCase().includes(this.filters.name.toLowerCase()) ||
          student.surname.toLowerCase().includes(this.filters.name.toLowerCase());
        const matchesTeacher =
          this.filters.teacher === "" || student.teacher === this.filters.teacher;
        const matchesSubject =
          this.filters.subject === "" || student.subject === this.filters.subject; // Subject bo'yicha filtr
        return matchesName && matchesTeacher && matchesSubject;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    },
    totalStudentsCount() {
      return this.students.length;
    },
    totalPayments() {
      return this.students.reduce((total, student) => total + Number(student.payment), 0);
    },
    modalTitle() {
      return this.modalType === "add" ? "Add Student" : "Edit Student";
    },
  },
  async created() {

const user = auth.currentUser;
if (user) {
  if (user.email === "admin@gmail.com") {
    this.isAdmin = true;
  }
  await this.fetchTeachers();
  await this.fetchSubjects();
}
},

  async created() {
    const user = auth.currentUser;
    if (user) {
      // Admin bo'lsa
      if (user.email === "admin@gmail.com") {
        this.isAdmin = true; // Admin ekanligini belgilash
        const studentSnapshot = await getDocs(collection(db, "students"));
        this.students = studentSnapshot.docs.map((doc) => doc.data());
    await this.fetchStudents(); // Ma'lumotlarni olish funksiyasini qo'shdim


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
      await this.fetchTeachers();
      await this.fetchSubjects();
    }
  },

  methods: {
    async fetchStudents() {
      const studentSnapshot = await getDocs(collection(db, "students"));
      this.students = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    async fetchTeachers() {
      const teacherSnapshot = await getDocs(collection(db, "teachers"));
      this.teachers = teacherSnapshot.docs.map((doc) => doc.data().name);
    },
    async fetchSubjects() {
      const subjectSnapshot = await getDocs(collection(db, "subjects"));
      this.subjects = subjectSnapshot.docs.map((doc) => doc.data().name);
    },
    async saveStudent() {
    try {
      // Saving logic here
      await setDoc(doc(db, "students", this.selectedStudentId || Date.now().toString()), this.studentForm);
      
      Toastify({
        text: "Student taxrirlandi !",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "#4CAF50", // Green
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();

      this.closeModal(); // Close modal after saving
      this.fetchStudents(); // Fetch students to update the list

    } catch (error) {
      console.error("Error saving student:", error);
      Toastify({
        text: "Error saving student.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336", // Red
      }).showToast();
    }
  },

  async deleteStudent(id) {
    try {
      await deleteDoc(doc(db, "students", id));
      Toastify({
        text: "O'quvchi muvofaqiyatli o'chirildi !",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336", // Red
      }).showToast();
      this.fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting student:", error);
      Toastify({
        text: "Error deleting student.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336", // Red
      }).showToast();
    }
  },

  exportToExcel() {
      const data = this.filteredStudents.map(student => {
        return {
          FISH: `${student.name} ${student.surname} `,
          Phone:`${student.phone}`
        };
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "O'quvchilar");
      XLSX.writeFile(wb, "O'quvchilar_Ro'yxati.xlsx");
    },
  // exportToExcel() {
  //   // Exporting logic here...
  //   const worksheet = XLSX.utils.json_to_sheet(this.students);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  //     XLSX.writeFile(workbook, "students.xlsx");
  //   Toastify({
  //     text: "Exported to Excel successfully!",
  //     duration: 3000,
  //     gravity: "top",
  //     position: "right",
  //     backgroundColor: "#4CAF50", // Green
  //   }).showToast();
  // },
    openAddModal() {
      this.showModal = true;
      this.modalType = "add";
      this.studentForm = {
        name: "",
        surname: "",
        phone: "",
        date: "",
        teacher: "",
        subject: "",
        payment: "",
      };
    },
    openEditModal(student) {
      this.showModal = true;
      this.modalType = "edit";
      this.studentForm = { ...student };
      this.selectedStudentId = student.id;
    },
    closeModal() {
      this.showModal = false;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
};
</script>

<style scoped>
/* Stil uchun ba'zi kodlar */
.pagination {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.pagination button {
  background-color: #3490dc;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal {
  /* Modal stil */
}

/* Custom styles can be added here */
.title_text {
  text-align: center;
}

.filters {
  margin-bottom: 20px;
}

.stats {
  margin-top: 20px;
}
.text-item{
  -webkit-text-stroke: 0.8px blue;
  font-weight: 900;
}

</style>