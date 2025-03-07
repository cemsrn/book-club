<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import getCurrentlyBorrowed from "@/api/Users/getCurrentlyBorrowed.js";

const router = useRouter();
const books = ref([]);
const loading = ref(false);

const goToUsers = () => {
  router.push("/");
};

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  books: {
    type: Array,
    default: () => [],
  },
});

const fetchUserBooks = async () => {
  loading.value = true;
  try {
    const borrowedBooks = await getCurrentlyBorrowed(props.user.id);
    books.value = borrowedBooks;
  } catch (error) {
    console.error(`Error fetching books for user ${props.user.id}:`, error);
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const viewUserDetails = () => {
  router.push(`/users/${props.user.id}`);
};

onMounted(fetchUserBooks);
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200 flex flex-col"
  >
    <div class="p-4 flex-1">
      <div class="flex items-center mb-4">
        <img
          :src="user.avatar"
          :alt="`${user.name}'s avatar`"
          class="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
          onerror="this.src='https://via.placeholder.com/150?text=No+Image'"
        />
        <div class="ml-4">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ user.name }}
          </h2>
          <p class="text-sm text-gray-600">{{ user.email }}</p>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="font-medium text-blue-700 mb-2">Currently Borrowing:</h3>
        <div v-if="loading" class="text-sm text-gray-500 italic">
          Loading books...
        </div>
        <div v-else-if="books && books.length">
          <ul class="space-y-2">
            <li
              v-for="book in books"
              :key="book.id"
              class="text-sm bg-blue-50 p-2 rounded flex items-start"
            >
              <span class="text-xs bg-blue-100 text-blue-800 rounded px-1 mr-2"
                >📚</span
              >
              {{ book.name }} by {{ book.author }}
            </li>
          </ul>
        </div>
        <p v-else class="text-sm text-gray-500 italic">
          No books currently borrowed
        </p>
      </div>
    </div>

    <div class="mt-auto p-4 bg-gray-50 border-t border-gray-100">
      <button
        @click="viewUserDetails"
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        View Details
      </button>
    </div>
  </div>
</template>
