<script>
import { getUserById } from "@/api/Users/getUserData";
import UserProfileHeader from "./UserProfileHeader.vue";
import BorrowedBooks from "./BorrowedBooks.vue";
import BorrowingHistory from "./BorrowingHistory.vue";
import LoadingAndErrorStates from "./LoadingAndErrorStates.vue";

export default {
  name: "UserDetails",
  components: {
    UserProfileHeader,
    BorrowedBooks,
    BorrowingHistory,
    LoadingAndErrorStates,
  },
  data() {
    return {
      user: null,
      loading: true,
      error: null,
      returnLoading: false,
      returnBookId: null,
    };
  },
  created() {
    this.fetchUserData();
  },
  watch: {
    $route: {
      handler() {
        this.fetchUserData();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    currentlyBorrowed() {
      if (!this.user || !this.user.history) return [];
      return this.user.history.filter((item) => item.status === "borrowed");
    },
  },
  methods: {
    // Data fetching method
    async fetchUserData() {
      try {
        this.loading = true;
        this.error = null;
        const userId = this.$route.params.id;
        this.user = await getUserById(userId);
      } catch (error) {
        this.error = `Failed to load user: ${error.message}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Book return handling
    async returnBook(bookId) {
      try {
        this.returnLoading = true;
        this.returnBookId = bookId;

        // 1. Update the book status to available
        const BASE_API = import.meta.env.VITE_BASE_API;
        const bookResponse = await fetch(`${BASE_API}/books/${bookId}`);
        const book = await bookResponse.json();

        await fetch(`${BASE_API}/books/${bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: true, // Set book to available
          }),
        });

        // 2. Update user history
        const userId = this.$route.params.id;
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
        await this.fetchUserData();
      } catch (error) {
        this.error = `Failed to return book: ${error.message}`;
        console.error(error);
      } finally {
        this.returnLoading = false;
        this.returnBookId = null;
      }
    },

    // Navigation method
    navigateToBorrowBooks() {
      this.$router.push(`/users/${this.$route.params.id}/borrow`);
    },
  },
};
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
