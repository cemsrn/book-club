<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  comparisonText: {
    type: String,
    default: "",
  },
  borderColor: {
    type: String,
    default: "border-blue-500",
  },
});
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md p-5 border-l-4"
    :class="borderColor"
  >
    <h2 class="text-gray-500 text-sm uppercase font-semibold">{{ title }}</h2>
    <div class="flex items-center mt-2">
      <div class="text-3xl font-bold text-gray-800">{{ value }}</div>
    </div>
    <p class="text-gray-500 text-sm mt-1">{{ comparisonText }}</p>
  </div>
</template>
