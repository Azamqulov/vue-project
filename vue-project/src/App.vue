<template>
  <mainLayouts>
    <router-view v-slot="{ Component }">
      <transition name="" mode="">
        <component :is="Component" />
      </transition>
    </router-view>
  </mainLayouts>
</template>
<script>
import { mapActions } from "vuex";
import mainLayouts from "./layouts/mainLayouts.vue";
export default {
  components: {
    mainLayouts,
  },
  methods: {
    ...mapActions("ui", ["Is_Actions"]),
    async ChekSaidbar() {
      const data = await this.Is_Actions();
      // console.log(data);
      if (data === null) {
        localStorage.setItem("saidbar-ui", JSON.stringify(false));
      }
    },
  },
  mounted() {
    this.ChekSaidbar();
  },
};
</script>
<style>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
body {
  overflow: hidden;
}
</style>
