<template>
      <div class="group-management">
        <h2 class="text-2xl font-bold text-center py-5">O'qituvchilar va o'quvchilar</h2>
        <div class="groups-list mt-6">
          <h3 class="text-xl font-semibold mb-4">O'quvchilar :</h3>
          <ul>
            <li v-for="group in filteredGroups" :key="group.id" class="mb-2">
              <div class="group flex justify-between items-center">
                <span class="font-bold">{{ group.name }} ({{ group.students.length }} o'quvchi)</span>
                <div>
                  <button class="bg-red-600 text-white px-3 py-1 rounded-md mr-2" @click="deleteGroup(group.id)">
                    O'chirish
                  </button>
                  <button class="bg-green-600 text-white px-3 py-1 rounded-md" @click="toggleStudentModal(group)">
                    O'quvchi Qo'shish
                  </button>
                </div>
              </div>
              <ul class="p-5">
                <li v-for="student in group.students" :key="student.id" class="flex justify-between bg-gray-100 px-5">
                  <span>{{ student.name }} {{ student.surname }}</span>
                  <button class="bg-red-400 text-white px-2 my-1 rounded-md" @click="removeStudent(group.id, student.id)">
                    O'chirish
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
    
        <!-- O'quvchi qo'shish modal oynasi -->
        <div v-if="showStudentModal" class="modal">
          <div class="modal-content">
            <h3 class="text-lg font-bold mb-4">{{ selectedGroup.name }} guruhiga o'quvchi qo'shish</h3>
    
            <select v-model="selectedStudent" class="border p-2 rounded-md w-full mb-4">
              <option value="" disabled>O'quvchini tanlang</option>
              <option v-for="student in availableStudents" :key="student.id" :value="student">
                {{ student.name }} {{ student.surname }}
              </option>
            </select>
    
            <div class="flex justify-end gap-4">
              <button class="bg-gray-400 text-white px-4 py-2 rounded-md" @click="toggleStudentModal()">
                Bekor qilish
              </button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md" @click="addStudent">
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script>
    import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
    import { db } from "@/firebaseConfig"; // Firebase konfiguratsiyasini import qilish
    
    export default {
      data() {
        return {
          selectedTeacher: "", // Tanlangan o'qituvchi
          newGroupName: "",
          groups: [],
          teachers: [], // O'qituvchilar ro'yxati
          showStudentModal: false,
          selectedGroup: null,
          students: [], // Barcha o'quvchilar ro'yxati
          selectedStudent: null, // Tanlangan o'quvchi
        };
      },
      async created() {
        await this.fetchGroups(); // Barcha guruhlarni olish
        await this.fetchTeachers(); // Barcha o'qituvchilarni olish
        await this.fetchStudents(); // Barcha o'quvchilarni olish
      },
      computed: {
        filteredGroups() {
          // Tanlangan o'qituvchiga mos guruhlarni filtrlaydi
          if (!this.selectedTeacher) {
            return this.groups; // Barcha guruhlarni ko'rsat
          }
          return this.groups.filter(group => 
            group.teacherId === this.selectedTeacher
          );
        },
        availableStudents() {
          // O'qituvchi IDsi yo'q, shuning uchun barcha o'quvchilarni olish
          return this.students.filter(student => !this.isStudentInGroup(student.id));
        }
      },
      methods: {
        async fetchGroups() {
          const groupsRef = collection(db, "groups");
          const querySnapshot = await getDocs(groupsRef);
          this.groups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        },
        async fetchTeachers() {
          const teachersRef = collection(db, "teachers");
          const querySnapshot = await getDocs(teachersRef);
          this.teachers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        },
        async fetchStudents() {
          const studentsRef = collection(db, "students");
          const querySnapshot = await getDocs(studentsRef);
          this.students = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        },
        async addGroup() {
          if (this.newGroupName) {
            await addDoc(collection(db, "groups"), {
              name: this.newGroupName,
              teacherId: this.selectedTeacher, // O'qituvchi ID'sini qo'shish
              students: [],
            });
            this.newGroupName = ""; // Inputni tozalash
            await this.fetchGroups(); // Yangi guruhlar ro'yxatini yangilash
          }
        },
        async deleteGroup(groupId) {
          await deleteDoc(doc(db, "groups", groupId));
          await this.fetchGroups(); // Yangi guruhlar ro'yxatini yangilash
        },
        toggleStudentModal(group = null) {
          this.showStudentModal = !this.showStudentModal;
          this.selectedGroup = group;
          this.selectedStudent = null; // Tanlangan o'quvchini yangilang
        },
        async addStudent() {
          if (this.selectedStudent && this.selectedGroup) {
            const groupRef = doc(db, "groups", this.selectedGroup.id);
            const updatedStudents = [
              ...this.selectedGroup.students,
              { id: this.selectedStudent.id, name: this.selectedStudent.name, surname: this.selectedStudent.surname }
            ];
            await updateDoc(groupRef, {
              students: updatedStudents,
            });
            this.toggleStudentModal(); // O'quvchi qo'shish oynasini yopish
            await this.fetchGroups(); // Yangi guruhlar ro'yxatini yangilash
          }
        },
        async removeStudent(groupId, studentId) {
          const groupRef = doc(db, "groups", groupId);
          const group = this.groups.find(g => g.id === groupId);
          const updatedStudents = group.students.filter(student => student.id !== studentId);
          await updateDoc(groupRef, {
            students: updatedStudents,
          });
          await this.fetchGroups(); // Yangi guruhlar ro'yxatini yangilash
        },
        isStudentInGroup(studentId) {
          // Guruhda o'quvchi bormi, tekshirish
          return this.selectedGroup && this.selectedGroup.students.some(student => student.id === studentId);
        }
      },
    };
    </script>
    
    <style scoped>
    /* Uslublar */
    .group-management {
      padding: 20px;
    }
    
    .filter-teacher {
      margin-bottom: 20px;
    }
    
    .groups-list ul {
      list-style-type: none;
      padding: 0;
    }
    
    .group {
      background-color: #f5f5f5;
      padding: 10px 15px;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      width: 400px;
      text-align: center;
    }
    
    .modal select {
      width: 100%;
    }
    
    .modal button {
      min-width: 100px;
    }
    </style>
    