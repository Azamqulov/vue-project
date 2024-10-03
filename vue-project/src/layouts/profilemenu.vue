<template>
  <div>
    <div class="profile-menu flex justify-between items-center bg-dark-grenn px-5 py-2 shadow-lg shadow-gray-400">
      <div class="toggle-saidbar-wrapper h-full">
        <div
          class="toggle-saidbar h-10 w-9 bg-white rounded-md p-1 flex"
          :class="Is_chek ? 'justify-end' : 'justify-start'"
          @click="ActiveSaidbar"
        >
          <div class="toggle h-full w-1/2 bg-dark rounded-md"></div>
        </div>
      </div>
      <div class="btn">
        <!-- Foydalanuvchi tizimga kirmagan bo'lsa login tugmasini ko'rsatish -->
        <router-link
          v-if="!user"
          class="bg-blue-800 py-2 px-5 rounded-md text-white"
          to="/login"
        >
          Login
        </router-link>
        <!-- Foydalanuvchi tizimga kirgan bo'lsa profil komponentini ko'rsatish -->
        <profilmain v-if="user"></profilmain>
      </div>
    </div>

    <!-- Profil dropdown menyusi -->
    <div v-if="showDropdown" class="modal absolute top-20 bg-gray-200 right-5 p-5">
      <div>
        <p>{{ user.displayName }}</p>
        <p>{{ user.email }}</p>
        <p>data: {{ user.metadata.creationTime }}</p>
        <button class="bg-red-500 py-1 px-5 mt-5" @click="logout">Chiqish</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import profilmain from "@/components/profilmain.vue";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default {
  components: { profilmain },
  data() {
    return {
      user: null,
      showDropdown: false,
    };
  },
  computed: {
    ...mapGetters("ui", ["Is_chek"]),
    userInitial() {
      return this.user ? this.user.displayName.charAt(0).toUpperCase() : "";
    },
  },
  methods: {
    ...mapActions("ui", ["Is_Menu"]),
    ActiveSaidbar() {
      this.Is_Menu();
      console.log("hey");
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
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
  },
};
</script>

<style scoped lang="scss">
/* Bu yerda CSS uslublaringizni o'rnatishingiz mumkin */
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
