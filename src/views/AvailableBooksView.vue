<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import SearchableList from "@/components/searchComponents/SearchableList.vue";

const route = useRoute();
const router = useRouter();
const { user: auth0User } = useAuth0();

const books = ref([]);
const loading = ref(true);
const error = ref(null);
const borrowingBook = ref(null);
const userId = route.params.id;

onMounted(async () => {
  await fetchAvailableBooks();
});

async function fetchAvailableBooks() {
  try {
    loading.value = true;
    const BASE_API = import.meta.env.VITE_BASE_API;
    const response = await fetch(`${BASE_API}/books?status=true`);

    if (!response.ok) {
      throw new Error(`Failed to fetch available books: ${response.status}`);
    }

    books.value = await response.json();
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

    // 1. Update book status to borrowed
    const bookResponse = await fetch(`${BASE_API}/books/${book.id}`);
    if (!bookResponse.ok) {
      throw new Error(`Failed to fetch book: ${bookResponse.status}`);
    }

    const bookData = await bookResponse.json();

    const bookUpdateResponse = await fetch(`${BASE_API}/books/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bookData,
        status: false, // Set to borrowed
        user_id: userId, // Associate with current user
      }),
    });

    if (!bookUpdateResponse.ok) {
      throw new Error(`Failed to update book: ${bookUpdateResponse.status}`);
    }

    // 2. Update user history
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

    const userUpdateResponse = await fetch(`${BASE_API}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        history: updatedHistory,
      }),
    });

    if (!userUpdateResponse.ok) {
      throw new Error(`Failed to update user: ${userUpdateResponse.status}`);
    }

    // Navigate back to user profile
    router.push("/member-profile");
  } catch (err) {
    error.value = err.message || "Failed to borrow book";
    console.error(err);
  } finally {
    borrowingBook.value = null;
  }
}

function goBack() {
  router.push("/member-profile");
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <button
      @click="goBack"
      class="mb-6 flex items-center text-blue-600 hover:text-blue-800"
    >
      <span class="mr-1">←</span> Back to Profile
    </button>

    <h1 class="text-2xl font-bold text-gray-800 mb-6">Borrow a Book</h1>

    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"
      ></div>
      <p class="mt-2 text-gray-600">Loading available books...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div
      v-else-if="books.length === 0"
      class="text-center py-8 bg-gray-100 rounded-lg"
    >
      <p class="text-gray-600">
        No books are currently available for borrowing.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200 flex flex-col h-full"
      >
        <div class="p-4 flex-1 flex flex-col">
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

          <div class="flex-1">
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
              borrowingBook === book.id ? "Processing..." : "Borrow This Book"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
