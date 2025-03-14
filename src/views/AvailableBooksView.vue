<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import SearchableList from "@/components/searchComponents/SearchableList.vue";
import BookGrid from "@/components/bookComponents/availableBooks/BookGrid.vue";

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
