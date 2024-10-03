<template>
  <div>
    <table>
      <thead>
        <tr>
          <th class="text-center font-bold">№ </th>
          <th>Ism</th>
          <th>Familiya</th>
          <th>Phone</th>
          <th>Date</th>
          <th>Action</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in students" :key="student.id">
          <td  class="text-center font-bold">{{ index + 1 }}</td>
          <td>{{ student.surname }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.date }}</td>

          <td class="text-center">
            <button @click="editStudent(student)" class="bg-blue-700 w-1/3"><i class="fa-solid fa-pen-to-square"></i></button>
            <button @click="deleteStudent(student.id)" class="bg-red-700 w-1/3"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination buttons -->
        <div class="pagination text-center my-5" >
          <button class="bg-green-800 rounded-full w-12 h-12" @click="prevPage" :disabled="currentPage === 1"><i class="fa-solid fa-angle-left"></i></button>
          <button class="bg-green-800 rounded-full w-12 h-12" @click="nextPage" :disabled="currentPage === totalPages"><i class="fa-solid fa-angle-right"></i></button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
        </div>
    <!-- //Edit Modal --> 
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEditModal = false">&times;</span>
        <h2>Talabani tahrirlash</h2>
        <form @submit.prevent="updateStudent">
          <div>
            <label for="firstName">Ism:</label>
            <input type="text" v-model="editForm.surname" required />
          </div>
          <div>
            <label for="lastName">Familiya:</label>
            <input type="text" v-model="editForm.name" required />
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

export default {
  data() {
    return {
      students: [], // Talabalar ro'yxati
      showEditModal: false, // Edit modalini ko'rsatish yoki yashirish
      editForm: {
        id: "",
        surname: "",
        name: ""
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
    }
  },
  methods: {
    async fetchStudents() {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        this.students = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Talabalarni yuklashda xato:", error);
        alert("Talabalarni yuklashda xato: " + error.message);
      }
    },
    async deleteStudent(studentId) {
      try {
        await deleteDoc(doc(db, "students", studentId));
        this.students = this.students.filter(student => student.id !== studentId);
        console.log("Talaba muvaffaqiyatli o'chirildi:", studentId);
      } catch (error) {
        console.error("Talaba o'chirilmadi:", error);
        alert("Talaba o'chirilmadi: " + error.message);
      }
    },
    editStudent(student) {
      // Tahrir qilish uchun talabaning ma'lumotlarini yuklash
      this.editForm = { ...student };
      // Edit modalini ko'rsatish
      this.showEditModal = true;
    },
    async updateStudent() {
      try {
        const studentRef = doc(db, "students", this.editForm.id);
        await updateDoc(studentRef, {
          name: this.editForm.name,
          surname: this.editForm.surname
        });
        // Talabalar ro'yxatini yangilash
        this.fetchStudents();
        // Edit modalini yopish
        this.showEditModal = false;
        console.log("Talaba muvaffaqiyatli tahrirlandi:", this.editForm.id);
      } catch (error) {
        console.error("Talaba tahrirlanmadi:", error);
        alert("Talaba tahrirlanmadi: " + error.message);
      }
    }
  },
  created() {
    this.fetchStudents(); // Komponent yuklanayotganda talabalarni yuklaymiz
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
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
  border-radius: 5px;
  width: 400px;
}

.close {
  float: right;
  font-size: 24px;
  cursor: pointer;
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
