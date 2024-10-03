<template>
  <div class="p-5">
    <h1 class="text-3xl font-bold text-center py-5 text-item">Teachers</h1>
    <button
      class="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4 font-bold"
      @click="openModal"
    >
       <i class="fa-solid fa-user-plus"></i> <span>Yangi O'qituvchi Qo'shish</span> 
    </button>

    <!-- Yangi O'qituvchi Qo'shish Modali -->
    <AddTeacher :show="isModalOpen" @close="closeModal"   />

    <table>
      <thead>
        <tr>
          <th class="text-center font-bold">№</th>
          <th>Familiya</th>
          <th>Ism</th>
          <th>Subject</th>
          <th>Login</th>

          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(teacher, index) in paginatedStudents" :key="teacher.id">
          <td class="text-center font-bold">{{ index + 1 }}</td>
          <td class="text-center" >{{ teacher.surname }}</td>
          <td class="text-center">{{ teacher.name }}</td>
          <td class="text-center">{{ teacher.subject }}</td>
          <td class="text-center">{{ teacher.email }}</td>

          <td class="text-center">
            <button @click="editStudent(teacher)" class="bg-blue-700 w-1/3">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button @click="deleteTeacher(teacher.id)" class="bg-red-700 w-1/3">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination buttons -->
    <div class="pagination text-center my-5 justify-end align-bottom mt-15">
      <button
        class="bg-green-800 rounded-full w-12 h-12"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        <i class="fa-solid fa-angle-left"></i>
      </button>
      <button
        class="bg-green-800 rounded-full w-12 h-12"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        <i class="fa-solid fa-angle-right"></i>
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>O'qituvchini tahrirlash</h2>
        <form @submit.prevent="updateStudent">
          <div>
            <label for="surname">Familiya:</label>
            <input type="text" v-model="editForm.surname" required />
          </div>
          <div>
            <label for="name">Ism:</label>
            <input type="text" v-model="editForm.name" required />
          </div>
          <div>
            <label for="subject">Subject:</label>
            <input type="text" v-model="editForm.subject" required />
          </div>
          <button type="submit" class="bg-green-700">Saqlash</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import AddTeacher from "../components/AddTeacher.vue";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default {
  components: { AddTeacher },
  data() {
    return {
      isModalOpen: false,
      students: [], // Talabalar ro'yxati
      showEditModal: false,
      editForm: {
        id: "",
        surname: "",
        name: "",
        subject: "" // Add subject to editForm
      },
      currentPage: 1, // Hozirgi sahifa
      itemsPerPage: 20, // Har bir sahifada ko'rsatiladigan elementlar soni
    };
  },
  computed: {
    paginatedStudents() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.students.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.students.length / this.itemsPerPage);
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async fetchStudents() {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        this.students = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        Toastify({
          text: "O'qituvchilar muvaffaqiyatli yuklandi!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
      } catch (error) {
        console.error("O'qituvchilarni yuklashda xato:", error);
        Toastify({
          text: "O'qituvchilarni yuklashda xato: " + error.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    },
    async deleteTeacher(teacherId) {
      try {
        await deleteDoc(doc(db, "teachers", teacherId));
        Toastify({
          text: "O'qituvchi muvaffaqiyatli o'chirildi!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
        this.fetchStudents();
      } catch (error) {
        console.error("O'qituvchini o'chirishda xato:", error);
        Toastify({
          text: "O'qituvchini o'chirishda xato: " + error.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    },

    editStudent(student) {
      this.editForm = { ...student }; // Load student data into editForm
      this.showEditModal = true; // Show edit modal
    },
    async updateStudent() {
      try {
        const teacherRef = doc(db, "teachers", this.editForm.id); // Use "teachers" collection
        await updateDoc(teacherRef, {
          name: this.editForm.name,
          surname: this.editForm.surname,
          subject: this.editForm.subject, // Update subject field
        });
        this.fetchStudents(); // Refresh the student list
        this.showEditModal = false; // Close the edit modal
        Toastify({
          text: "O'qituvchi muvaffaqiyatli tahrirlandi!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
      } catch (error) {
        console.error("O'qituvchini tahrirlanmadi:", error);
        Toastify({
          text: "O'qituvchini tahrirlanmadi: " + error.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    },
  },
  created() {
    this.fetchStudents(); // Komponent yuklanayotganda talabalarni yuklaymiz
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  border: 1px solid #ddd;
}
button {
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}
.text-item{
  -webkit-text-stroke: 0.8px blue;
  font-weight: 900;
}


.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}
</style>
