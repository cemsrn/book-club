<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchableList from "@/components/searchComponents/SearchableList.vue";
import getAvailableBooks from "@/api/Books/getAvailableBooks";

const route = useRoute();
const router = useRouter();
const books = ref([]);
const loading = ref(true);
const error = ref(null);
const borrowingBook = ref(null);

let userId = route.params.id;

// Handle potential issues with route parameters
if (!userId && route.params.userId) {
  userId = route.params.userId;
}

onMounted(async () => {
  await fetchAvailableBooks();
});

async function fetchAvailableBooks() {
  try {
    loading.value = true;
    books.value = await getAvailableBooks();
  } catch (err) {
    error.value = err.message || "Failed to load available books";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function borrowBook(book) {
  try {
    if (!userId) {
      error.value = "User ID is missing. Cannot complete borrow operation.";
      console.error("Missing userId:", route.params);
      return;
    }

    borrowingBook.value = book.id;
    const BASE_API = import.meta.env.VITE_BASE_API;

    // Update book status to borrowed
    await fetch(`${BASE_API}/books/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: false, // Set to borrowed
      }),
    });

    // Update user history
    const userResponse = await fetch(`${BASE_API}/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const newBorrowRecord = {
      book_id: book.id,
      book_name: book.name,
      action: "borrow",
      borrow_date: new Date().toISOString(),
      author: book.author,
      publishing_house: book.publishing_house,
      language: book.language,
      status: "borrowed",
    };

    const updatedHistory = [newBorrowRecord, ...(userData.history || [])];

    await fetch(`${BASE_API}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history: updatedHistory,
      }),
    });

    // Navigate back to user details
    router.push(`/users/${userId}`);
  } catch (err) {
    error.value = err.message || "Failed to borrow book";
    console.error(err);
  } finally {
    borrowingBook.value = null;
  }
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <button
      @click="goBack"
      class="mb-6 flex items-center text-blue-600 hover:text-blue-800"
    >
      <span class="mr-1">←</span> Back to User Details
    </button>

    <h1 class="text-2xl font-bold text-gray-800 mb-6">Borrow a Book</h1>

    <SearchableList
      :items="books"
      :loading="loading"
      :error="error"
      :search-fields="['name', 'author', 'publishing_house']"
      search-placeholder="Search books by title, author or publisher..."
    >
      <!-- Custom rendering of the book list -->
      <template v-slot:default="{ items }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="book in items"
            :key="book.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200"
          >
            <div class="p-4">
              <div class="mb-4">
                <img
                  v-if="book.image"
                  :src="book.image"
                  :alt="`Cover of ${book.name}`"
                  class="w-full h-48 object-cover rounded-md"
                />
                <div
                  v-else
                  class="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center"
                >
                  <span class="text-gray-500">No cover available</span>
                </div>
              </div>

              <h2 class="text-lg font-semibold text-gray-800 mb-2">
                {{ book.name }}
              </h2>
              <p class="text-gray-700 mb-2">
                by <span class="font-medium">{{ book.author }}</span>
              </p>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ book.publishing_house }}
                </span>
                <span
                  class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ book.language }}
                </span>
              </div>

              <button
                @click="borrowBook(book)"
                :disabled="borrowingBook === book.id"
                class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md transition duration-300 flex items-center justify-center"
              >
                <div v-if="borrowingBook === book.id" class="mr-2">
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"
                  ></div>
                </div>
                {{
                  borrowingBook === book.id
                    ? "Processing..."
                    : "Borrow This Book"
                }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </SearchableList>
  </div>
</template>
