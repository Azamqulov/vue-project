<template>
  <div class="pagination text-center my-5  m-auto  flex justify-center items-center">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center"
    >
      <i class="fa-solid fa-angle-left"></i>
    </button>
    <span class="mx-4 text-xl font-bold">Saxifa {{ currentPage }} of {{ totalPages }}</span>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center"
    >
      <i class="fa-solid fa-angle-right"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    prevPage() {
      this.$emit("prev");
    },
    nextPage() {
      this.$emit("next");
    },
  },
};
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
