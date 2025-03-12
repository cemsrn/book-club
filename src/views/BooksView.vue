<script setup>
import { ref, onMounted } from "vue";
import getAllBooks from "@/api/Books/getAllBooks.js";
import deleteBook from "@/api/Books/deleteBook.js";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Book from "@/components/bookComponents/Book.vue";
import BackToHome from "@/components/buttons/BackToHome.vue";
import SearchableList from "@/components/searchComponents/SearchableList.vue";

const router = useRouter();
const allBooks = ref([]);
const loading = ref(false);
const isDeleting = ref(false);
const deletingBookId = ref(null);

// Navigation
function goToHome() {
  router.push("/");
}

function goToAddNewBook() {
  router.push("/books/add");
}

// Fetch initial data
async function fetchBooks() {
  loading.value = true;

  try {
    const data = await getAllBooks();
    allBooks.value = data;
  } catch (err) {
    console.error("Couldn't load books:", err);
  } finally {
    loading.value = false;
  }
}

// Handle book deletion
async function handleDeleteBook(id) {
  // Simple confirm dialog
  if (!confirm("Delete this book?")) return;

  deletingBookId.value = id;
  isDeleting.value = true;

  try {
    await deleteBook(id);

    // Update array after successful delete
    allBooks.value = allBooks.value.filter((book) => book.id !== id);
  } catch (err) {
    alert("Couldn't delete the book. Try again?");
    console.error("Delete error:", err);
  } finally {
    isDeleting.value = false;
    deletingBookId.value = null;
  }
}

onMounted(fetchBooks);
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <BackToHome />

    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">Books</h1>

    <!-- Add New Book Button -->
    <div class="flex justify-center mb-8">
      <button
        @click="goToAddNewBook"
        class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
      >
        <div class="relative w-5 h-5 mr-2">
          <div
            class="absolute w-5 h-0.5 bg-white top-1/2 -translate-y-1/2"
          ></div>
          <div
            class="absolute h-5 w-0.5 bg-white left-1/2 -translate-x-1/2"
          ></div>
        </div>
        Add New Book
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center mb-8">
      <LoadingSpinner size="md" text="Loading books..." />
    </div>

    <div v-else>
      <!-- Search functionality -->
      <SearchableList
        :items="allBooks"
        :search-fields="['name', 'author', 'publishing_house']"
        :loading="loading"
        search-placeholder="Search books by title, author or publisher..."
        :max-suggestions="5"
        v-slot="{ items: filteredItems }"
        class="mb-6"
      >
        <template v-if="filteredItems && filteredItems.length > 0">
          <!-- Search results notification -->
          <div v-if="filteredItems !== allBooks" class="mb-4 text-center">
            <p class="text-blue-700">
              {{ filteredItems.length }} matching books found
            </p>
          </div>

          <!-- Books Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            <Book
              v-for="book in filteredItems"
              :key="book.id"
              :book="book"
              :is-deleting="isDeleting"
              :deleting-book-id="deletingBookId"
              @delete="handleDeleteBook"
            />
          </div>

          <!-- Book Count Display -->
          <div class="text-center text-gray-600 mt-4">
            <span v-if="filteredItems !== allBooks">
              Showing {{ filteredItems.length }} filtered results
            </span>
            <span v-else> Showing all {{ allBooks.length }} books </span>
          </div>
        </template>
      </SearchableList>
    </div>
  </main>
</template>
