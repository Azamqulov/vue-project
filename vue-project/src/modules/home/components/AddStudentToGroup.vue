<template>
      <div>
        <h2>O'quvchini guruhga qo'shish</h2>
        <form @submit.prevent="addStudent">
          <select v-model="selectedStudent">
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }}
            </option>
          </select>
          <select v-model="selectedGroup">
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
          <button type="submit">Qo'shish</button>
        </form>
      </div>
    </template>
    
    <script>
    import { db } from "@/firebaseConfig";
    import { collection, addDoc } from "firebase/firestore";
    
    export default {
      data() {
        return {
          students: [], // O'quvchilar ro'yxati Firebase'dan olinadi
          groups: [], // Guruhlar ro'yxati
          selectedStudent: null,
          selectedGroup: null,
        };
      },
      methods: {
        async addStudent() {
          await addDoc(collection(db, "group_students"), {
            studentId: this.selectedStudent,
            groupId: this.selectedGroup,
          });
          alert("O'quvchi guruhga qo'shildi");
        },
        async fetchGroups() {
          // Guruhlarni Firebase'dan olish funksiyasi
        },
        async fetchStudents() {
          // O'quvchilarni Firebase'dan olish funksiyasi
        },
      },
      mounted() {
        this.fetchGroups();
        this.fetchStudents();
      },
    };
    </script>
    