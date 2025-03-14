<script setup>
import { defineProps } from "vue";

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["action"]);
</script>

<template>
  <div
    class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
  >
    <div class="p-4 flex-grow flex flex-col">
      <div class="flex-grow">
        <img
          :src="book.image"
          :alt="book.name"
          class="w-full h-48 object-cover object-center mb-4"
          @error="
            $event.target.src = 'https://via.placeholder.com/150?text=No+Image'
          "
        />
        <h3 class="font-bold text-lg mb-2">{{ book.name }}</h3>
        <p class="text-gray-600 mb-1">Author: {{ book.author }}</p>
        <p class="text-gray-600 mb-1">Publisher: {{ book.publishing_house }}</p>
        <p class="text-gray-600 mb-4">Language: {{ book.language }}</p>
      </div>

      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors mt-auto"
        :disabled="isLoading"
        @click="$emit('action')"
      >
        <span v-if="isLoading">Borrowing...</span>
        <span v-else>Borrow Book</span>
      </button>
    </div>
  </div>
</template>
