<script setup>
defineProps({
  message: {
    type: String,
    default: "Loading dashboard data...",
  },
});
</script>

<template>
  <div class="flex justify-center items-center min-h-[300px]">
    <div class="flex items-center font-semibold text-indigo-600">
      <div
        class="mr-3 h-6 w-6 rounded-full border-3 border-gray-200 border-t-indigo-600 animate-spin"
      ></div>
      {{ message }}
    </div>
  </div>
</template>
