<template>
  <div>
    <nav>
      <div v-if="user" class="border-none">
        <!-- Foydalanuvchi profili -->
        <button @click="toggleDropdown" ref="dropdownButton">{{ userInitial }}</button>
      </div>
    </nav>
  </div>
  <div v-if="showDropdown" class="modal absolute top-20 bg-gray-300 right-5 p-5" ref="dropdown">
    <div>
      <p>{{ user.displayName }}</p>
      <p>{{ user.email }}</p>
      <!-- <p>Data: {{ user.metadata.creationTime }}</p> -->
      <button class="bg-red-500 py-1 px-5 mt-5" @click="logout">Chiqish <i class="fa-solid fa-right-from-bracket"></i></button>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default {
  data() {
    return {
      user: null,
      showDropdown: false,
    };
  },
  computed: {
    userInitial() {
      return this.user ? this.user.displayName.charAt(0).toUpperCase() : "";
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.dropdown;
      const button = this.$refs.dropdownButton;

      // Check if the click happened outside the dropdown and button
      if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
        this.showDropdown = false; // Close the dropdown
      }
    },
    logout() {
      signOut(auth).then(() => {
        this.user = null;
      });
    },
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });

    // Add a click event listener to the document when the component is created
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
/* Custom styles for the component */
nav button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
}

nav div p {
  margin: 0;
}

nav div button {
  background-color: red;
  color: white;
  cursor: pointer;
}
</style>
