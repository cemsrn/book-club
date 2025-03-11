<script setup>
const props = defineProps({
  borrowedBooks: {
    type: Array,
    required: true,
  },
  isReturning: Boolean,
  returningBookId: [String, Number],
});

const emit = defineEmits(["return-book", "navigate-borrow"]);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleReturnBook = (bookId) => {
  // Forward the event to parent
  emit("return-book", bookId);
};

const navigateToBorrowBooks = () => {
  emit("navigate-borrow");
};
</script>

<template>
  <div>
    <h2
      class="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200"
    >
      Currently Borrowed Books
    </h2>

    <!-- Display borrowed books if any -->
    <div v-if="borrowedBooks.length > 0" class="space-y-4 mb-8">
      <div
        v-for="(item, index) in borrowedBooks"
        :key="`current-${index}`"
        class="bg-blue-50 p-4 rounded-lg border border-blue-300 flex flex-col md:flex-row justify-between"
      >
        <div class="flex-grow">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">
              <router-link
                :to="`/books/${item.book_id}`"
                class="text-blue-700 hover:text-blue-900 hover:underline"
              >
                {{ item.book_name }}
              </router-link>
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p class="text-gray-700">
              <span class="font-medium">Author:</span> {{ item.author }}
            </p>
            <p class="text-gray-700">
              <span class="font-medium">Publisher:</span>
              {{ item.publishing_house }}
            </p>
            <p class="text-gray-700">
              <span class="font-medium">Borrowed on:</span>
              {{ formatDate(item.borrow_date) }}
            </p>
          </div>
        </div>

        <div class="mt-4 md:mt-0 md:ml-4 md:flex md:items-start">
          <button
            @click="handleReturnBook(item.book_id)"
            :disabled="isReturning && returningBookId === item.book_id"
            class="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300 flex items-center justify-center"
          >
            <span
              v-if="isReturning && returningBookId === item.book_id"
              class="mr-2"
            >
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{
              isReturning && returningBookId === item.book_id
                ? "Returning..."
                : "Return Book"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state message -->
    <div
      v-else
      class="mb-8 p-4 bg-gray-50 rounded-lg text-gray-600 italic text-center"
    >
      This user is not currently borrowing any books.
    </div>

    <!-- Borrow New Book Button -->
    <div class="mt-6 text-center">
      <button
        @click="navigateToBorrowBooks"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Borrow New Book
      </button>
    </div>
  </div>
</template>
