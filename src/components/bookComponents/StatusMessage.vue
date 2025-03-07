<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["error", "success"].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    :class="{
      'bg-red-100 border-red-400 text-red-700': type === 'error',
      'bg-green-100 border-green-400 text-green-700': type === 'success',
    }"
    class="border px-4 py-3 rounded mb-6 transition-opacity duration-300"
  >
    {{ message }}
  </div>
</template>
