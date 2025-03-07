<script setup>
const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>

<template>
  <button
    @click="handleClick"
    class="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center mb-6"
  >
    <span class="mr-2 text-lg">←</span>
    <slot>Back</slot>
  </button>
</template>
