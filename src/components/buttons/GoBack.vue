<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="absolute top-4 left-4">
    <button
      @click="goBack"
      class="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center sm:justify-start"
    >
      <span
        class="sm:mr-2 text-2xl font-black transform transition-transform duration-300 hover:translate-x-[-2px] leading-none"
        style="text-shadow: 0 0 1px white"
        >←</span
      >
      <span class="hidden sm:inline">Back</span>
    </button>
  </div>
</template>
