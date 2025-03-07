<script setup>
defineProps({
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  text: {
    type: String,
    default: "Loading...",
  },
});
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      :class="{
        'h-5 w-5': size === 'sm',
        'h-8 w-8': size === 'md',
        'h-12 w-12': size === 'lg',
      }"
      class="relative rounded-full border-4 border-t-transparent border-blue-600/25 animate-spin mr-3"
    >
      <div
        class="absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-4 border-l-4 border-blue-600 border-r-transparent border-b-transparent opacity-75"
      ></div>
    </div>

    <span v-if="text" class="text-lg font-medium text-blue-600">{{
      text
    }}</span>
  </div>
</template>
