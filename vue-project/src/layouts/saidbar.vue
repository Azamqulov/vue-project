<template>
  <div :class="{ active: chek }" class="saidbar bg-dark text-white">
    <div v-if="!chek" class="max-saidbar flex flex-col justify-between h-screen">
     <router-link to="/">
      <div class="logo text-center items-center p-5">
        <img
          src="../assets/image/logo/biglogo.png"
          class="w-20 m-auto rounded-full"
          alt="Smart Academy Logo"
        />
        <span class="ml-2 mt-5 text-2xl font-bold"> SMART ACADEMY </span>
        <hr class="my-10 block" />
      </div>
     </router-link>
      <!-- Menu -->
      <ul class="p-5">
        <li
          class="p-2 flex items-center rounded-md mb-3 text-2xl cursor-pointer hover:bg-dark-grenn"
          v-for="(item, idx) in mainConfig"
          :key="idx"
          :class="{ 'bg-dark-grenn': item.routerName.includes($route.name) }"
          @click="SendPush(item, idx)"
        >
          <i :class="item.icons"></i>
          <span class="text-xl ml-2">{{ item.name }}</span>
        </li>
      </ul>
      <div class="p-5">
        <hr class="mb-5" />
        <span class="text-center w-full m-auto py-5">@Musurmon_dev</span>
      </div>
    </div>
    <!-- Max Sidebar End -->
    <div
      v-if="chek"
      class="min-saidbar flex flex-col items-center p-5 h-screen" >
      <router-link to="/">
        <img
          src="../assets/image/logo/biglogo.png"
          class="w-12 rounded-full"
          alt="Smart Academy Logo"
        />
      </router-link>
      <ul class="py-5 m-auto">
        <li
          class="p-2 pr-1 flex text-2xl items-center rounded-md mb-3 cursor-pointer hover:bg-dark-grenn"
          v-for="(item, idx) in mainConfig"
          :key="idx"
          :class="{ 'bg-dark-grenn': item.routerName.includes($route.name) }"
          @click="SendPush(item, idx)"
        >
          <i :class="item.icons"></i>
          <template>
            <font-awesome-icon :icon="['fas', 'house']" />
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mainConfig from "./mainConfig";

export default {
  data() {
    return {
      mainConfig,
    };
  },
  computed: {
    ...mapState("ui", ["chek"]),
  },
  methods: {
    SendPush(item) {
      this.$router.push({ name: item.PageName });
    },
  },
};
</script>

<style lang="scss">

.saidbar {
  width: 300px;
  height: 100vh;
  transition: 0.5s;

  &.active {
    width: 100px;
  }
}
</style>
