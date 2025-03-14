<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchableList from "@/components/searchComponents/SearchableList.vue";
import BookGrid from "@/components/bookComponents/availableBooks/BookGrid.vue";
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
    const bookResponse = await fetch(`${BASE_API}/books/${book.id}`);
    if (!bookResponse.ok) {
      throw new Error(`Failed to fetch book: ${bookResponse.status}`);
    }

    const bookData = await bookResponse.json();

    await fetch(`${BASE_API}/books/${book.id}`, {
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
        ...userData,
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
      <template v-slot:default="{ items }">
        <BookGrid
          :books="items"
          :loadingBookId="borrowingBook"
          emptyMessage="No books are currently available for borrowing."
          @borrow="borrowBook"
        />
      </template>
    </SearchableList>
  </div>
</template>
