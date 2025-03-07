<script setup>
import { ref, onMounted, computed } from "vue";
import getAllBooks from "@/api/Books/getAllBooks.js";
import deleteBook from "@/api/Books/deleteBook.js";
import { useRouter } from "vue-router";
import defaultAvatar from "@/assets/images/default-avatar.svg";
import LoadMoreButton from "@/components/buttons/LoadMore.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Book from "@/components/bookComponents/Book.vue";
import BackToHome from "@/components/buttons/BackToHome.vue";

const router = useRouter();
const allBooks = ref([]);
const books = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const isDeleting = ref(false);
const deletingBookId = ref(null);

// Pagination
const booksPerPage = 8;
const currentCount = ref(0);

// Navigation
function goToHome() {
  router.push("/");
}

function goToAddNewBook() {
  router.push("/books/add");
}

const hasMoreBooks = computed(() => currentCount.value < allBooks.value.length);

// Fetch initial data
async function fetchBooks() {
  loading.value = true;

  try {
    const data = await getAllBooks();
    allBooks.value = data;

    // Show initial batch
    currentCount.value = Math.min(booksPerPage, data.length);
    books.value = data.slice(0, currentCount.value);
  } catch (err) {
    console.error("Couldn't load books:", err);
  } finally {
    loading.value = false;
  }
}

// Load more books when scrolling
async function loadMoreBooks() {
  if (loadingMore.value || !hasMoreBooks.value) return;

  loadingMore.value = true;

  try {
    // Figure out how many more to show
    const nextBatch = Math.min(
      booksPerPage,
      allBooks.value.length - currentCount.value
    );

    currentCount.value += nextBatch;
    books.value = allBooks.value.slice(0, currentCount.value);
  } catch (err) {
    console.error("Failed loading more books:", err);
  } finally {
    loadingMore.value = false;
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

    // Update both arrays after successful delete
    allBooks.value = allBooks.value.filter((book) => book.id !== id);
    books.value = books.value.filter((book) => book.id !== id);
    currentCount.value = books.value.length;
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

    <!-- Books Grid -->
    <div
      v-if="books.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
    >
      <Book
        v-for="book in books"
        :key="book.id"
        :book="book"
        :is-deleting="isDeleting"
        :deleting-book-id="deletingBookId"
        @delete="handleDeleteBook"
      />
    </div>

    <!-- Load More Button - Updated to use the component -->
    <LoadMoreButton
      v-if="hasMoreBooks && !loading"
      :is-loading="loadingMore"
      :has-more-items="hasMoreBooks"
      button-text="Show More Books"
      loading-text="Loading..."
      @load-more="loadMoreBooks"
    />

    <!-- Book Count Display -->
    <div v-if="books.length && !loading" class="text-center text-gray-600 mt-4">
      Showing {{ currentCount }} of {{ allBooks.length }} books
    </div>
  </main>
</template>
