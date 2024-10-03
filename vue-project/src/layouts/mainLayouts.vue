<template>
  <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <main class="main-layouts h-screen overflow-hidden">
      <Saidbar v-if="isLoggedIn" /> <!-- Faqat foydalanuvchi tizimga kirganida ko'rsatilsin -->
      <div class="menu-wrapper flex flex-col">
        <Profilemenu v-if="isLoggedIn" /> <!-- Faqat foydalanuvchi tizimga kirganida ko'rsatilsin -->
        <div class="menu-router-content grow overflow-y-scroll">
          <slot />
        </div>
      </div>
      <LoginModal v-if="!isLoggedIn" @login-success="handleLoginSuccess" /> <!-- Agar foydalanuvchi tizimga kirgan bo'lmasa, login modali ko'rsatiladi -->
    </main>
  </transition>
</template>
<script>
import Profilemenu from './profilemenu.vue';
import Saidbar from './saidbar.vue';
import LoginModal from '@/modules/auth/views/Login.vue'; // LoginModal komponenti
import { auth } from '@/firebaseConfig'; // Firebase konfiguratsiyasi
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth holatini o'zgartirish

export default {
  components: { Saidbar, Profilemenu, LoginModal },
  data() {
    return {
      isLoggedIn: false, // Tizimga kirish holatini saqlash uchun
    };
  },
  created() {
    // Foydalanuvchi holatini kuzatish
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user; // Foydalanuvchi tizimga kirganmi yoki yo'qmi
    });
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true; // Tizimga kirish holatini yangilash
    },
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      el.offsetHeight; // reflow ni chaqirish
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = 1;
      done();
    },
    leave(el, done) {
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = 0;
      done();
    },
  },
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.main-layouts {
  display: flex;
  .menu-wrapper {
    flex-grow: 1;
    .menu-router-content::-webkit-scrollbar {
      display: none;
    }
  }
  ::-webkit-scrollbar {
    width: 20px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: red;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #b30000;
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
