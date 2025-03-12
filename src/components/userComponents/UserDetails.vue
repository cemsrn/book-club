<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserById } from "@/api/Users/getUserData";
import UserProfileHeader from "./UserProfileHeader.vue";
import BorrowedBooks from "./BorrowedBooks.vue";
import BorrowingHistory from "./BorrowingHistory.vue";
import LoadingAndErrorStates from "./LoadingAndErrorStates.vue";

const route = useRoute();
const router = useRouter();

const user = ref(null);
const loading = ref(true);
const error = ref(null);
const returnLoading = ref(false);
const returnBookId = ref(null);

// Computed properties
const currentlyBorrowed = computed(() => {
  if (!user.value || !user.value.history) return [];
  return user.value.history.filter((item) => item.status === "borrowed");
});

// Data fetching method
const fetchUserData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const userId = route.params.id;
    user.value = await getUserById(userId);
  } catch (err) {
    error.value = `Failed to load user: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Book return handling
const returnBook = async (bookId) => {
  try {
    returnLoading.value = true;
    returnBookId.value = bookId;

    // Update the book status to available
    const BASE_API = import.meta.env.VITE_BASE_API;
    const bookResponse = await fetch(`${BASE_API}/books/${bookId}`);
    await bookResponse.json();

    await fetch(`${BASE_API}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: true, // Set book to available
      }),
    });

    // Update user history
    const userId = route.params.id;
    const userResponse = await fetch(`${BASE_API}/users/${userId}`);
    const userData = await userResponse.json();

    // Find the borrowed book in history and mark as returned
    const updatedHistory = userData.history.map((item) => {
      if (item.book_id === bookId && item.status === "borrowed") {
        return {
          ...item,
          status: "returned",
          return_date: new Date().toISOString(),
        };
      }
      return item;
    });

    await fetch(`${BASE_API}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history: updatedHistory,
      }),
    });

    // Refresh user data
    await fetchUserData();
  } catch (err) {
    error.value = `Failed to return book: ${err.message}`;
    console.error(err);
  } finally {
    returnLoading.value = false;
    returnBookId.value = null;
  }
};

// Navigation method
const navigateToBorrowBooks = () => {
  router.push(`/users/${route.params.id}/borrow`);
};

// Watch for route changes
watch(
  () => route.params,
  () => fetchUserData(),
  { immediate: true, deep: true }
);

// Initial data fetch
onMounted(fetchUserData);
</script>

<template>
  <!-- Main content when data is loaded -->
  <div v-if="user" class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <!-- User Profile Section -->
    <UserProfileHeader :user="user" />

    <!-- Currently Borrowed Books Section -->
    <div class="mt-10">
      <BorrowedBooks
        :borrowed-books="currentlyBorrowed"
        :is-returning="returnLoading"
        :returning-book-id="returnBookId"
        @return-book="returnBook"
        @navigate-borrow="navigateToBorrowBooks"
      />
    </div>

    <!-- Borrowing History Section -->
    <div class="mt-10">
      <BorrowingHistory :history="user.history" />
    </div>
  </div>

  <!-- Loading and Error States -->
  <LoadingAndErrorStates v-else :loading="loading" :error="error" />
</template>
