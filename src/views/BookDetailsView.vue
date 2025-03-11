<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import getBook from "@/api/Books/getBook";

const route = useRoute();
const router = useRouter();
const book = ref(null);
const loading = ref(true);
const error = ref(null);
const borrowingUser = ref(null);
const userLoading = ref(false);

// Check if the book is currently borrowed
const isBorrowed = computed(() => {
  return book.value && book.value.status === false;
});

onMounted(async () => {
  try {
    const bookId = route.params.id;
    loading.value = true;
    book.value = await getBook(bookId);

    // If the book is borrowed, fetch the borrowing user
    if (isBorrowed.value && book.value.user_id) {
      await fetchBorrowingUser(book.value.user_id);
    }
  } catch (err) {
    error.value = err.message || "Failed to load book details";
  } finally {
    loading.value = false;
  }
});

// Fetch the user who borrowed the book
async function fetchBorrowingUser(userId) {
  try {
    userLoading.value = true;
    const BASE_API = import.meta.env.VITE_BASE_API;
    const response = await fetch(`${BASE_API}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch borrowing user: ${response.status}`);
    }

    borrowingUser.value = await response.json();
  } catch (err) {
    console.error("Error fetching borrowing user:", err);
  } finally {
    userLoading.value = false;
  }
}

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <button
      @click="goBack"
      class="mb-6 flex items-center text-blue-600 hover:text-blue-800"
    >
      <span class="mr-1">←</span> Back to Books
    </button>

    <div v-if="loading" class="flex justify-center p-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
      <p>{{ error }}</p>
    </div>

    <div
      v-else-if="book"
      class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
    >
      <div class="md:flex">
        <div class="md:w-1/3 p-4">
          <img
            v-if="book.image"
            :src="book.image"
            :alt="`Cover of ${book.name}`"
            class="w-full rounded-md object-cover h-80"
          />
          <div
            v-else
            class="w-full h-80 bg-gray-200 rounded-md flex items-center justify-center"
          >
            <span class="text-gray-500">No cover available</span>
          </div>
        </div>

        <div class="md:w-2/3 p-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ book.name }}</h1>
          <p class="text-lg text-gray-700 mb-4">
            by <span class="font-semibold">{{ book.author }}</span>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-1">
                Publishing House
              </h2>
              <p>{{ book.publishing_house }}</p>
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-1">Language</h2>
              <p>{{ book.language }}</p>
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-1">ISBN</h2>
              <p>{{ book.isbn }}</p>
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-1">Price</h2>
              <p>${{ book.price }}</p>
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-1">Status</h2>
              <span
                v-if="book.status"
                class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                Available
              </span>
              <span
                v-else
                class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                Borrowed
              </span>
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-1">
                Last Updated
              </h2>
              <p>{{ new Date(book.updatedAt).toLocaleDateString() }}</p>
            </div>

            <div v-if="!book.status" class="col-span-2 mt-2">
              <h2 class="text-sm font-semibold text-gray-500 mb-1">
                Currently Borrowed By
              </h2>
              <div v-if="userLoading" class="flex items-center text-gray-600">
                <div
                  class="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-blue-600 rounded-full"
                ></div>
                Loading user information...
              </div>
              <div v-else-if="borrowingUser" class="flex items-center">
                <router-link
                  :to="`/users/${borrowingUser.id}`"
                  class="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <img
                    v-if="borrowingUser.avatar"
                    :src="borrowingUser.avatar"
                    :alt="borrowingUser.name"
                    class="w-6 h-6 rounded-full mr-2 object-cover"
                  />
                  <span>{{ borrowingUser.name }}</span>
                </router-link>
              </div>
              <p v-else class="text-gray-600 italic">
                User information not available
              </p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <router-link :to="`/books/${book.id}/edit`">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Edit Book
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
