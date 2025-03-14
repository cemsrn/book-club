<script setup>
import { defineProps } from "vue";
import BookCard from "./BookCard.vue";

const props = defineProps({
  books: {
    type: Array,
    required: true,
  },
  loadingBookId: {
    type: [String, Number],
    default: null,
  },
  emptyMessage: {
    type: String,
    default: "No books are currently available.",
  },
});

defineEmits(["borrow"]);
</script>

<template>
  <div>
    <div
      v-if="books.length === 0"
      class="text-center py-8 bg-gray-100 rounded-lg"
    >
      <p class="text-gray-600">
        {{ emptyMessage }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        :isLoading="loadingBookId === book.id"
        @action="$emit('borrow', book)"
      />
    </div>
  </div>
</template>
