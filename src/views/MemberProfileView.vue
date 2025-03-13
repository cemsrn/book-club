<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useRouter } from "vue-router";
import UserProfileHeader from "@/components/userComponents/UserProfileHeader.vue";
import BorrowedBooks from "@/components/userComponents/BorrowedBooks.vue";
import BorrowingHistory from "@/components/userComponents/BorrowingHistory.vue";
import LoadingAndErrorStates from "@/components/userComponents/LoadingAndErrorStates.vue";

// Get Auth0 user
const { user: auth0User } = useAuth0();
const router = useRouter();

// Local state
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

// Find user by email in MockAPI
const findUserByEmail = async (email) => {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;
    const response = await fetch(`${BASE_API}/users`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const users = await response.json();
    const matchingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchingUser) {
      throw new Error(
        "No matching user found for your account. Please contact support."
      );
    }

    return matchingUser;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Data fetching method
const fetchUserData = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!auth0User.value || !auth0User.value.email) {
      throw new Error("No authenticated user information available");
    }

    // Find user by email
    const matchingUser = await findUserByEmail(auth0User.value.email);
    user.value = matchingUser;
  } catch (err) {
    error.value = `Failed to load profile: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Book return handling
const returnBook = async (bookId) => {
  try {
    if (!user.value || !user.value.id) {
      throw new Error("User information not available");
    }

    returnLoading.value = true;
    returnBookId.value = bookId;

    // Update the book status to available
    const BASE_API = import.meta.env.VITE_BASE_API;
    const bookResponse = await fetch(`${BASE_API}/books/${bookId}`);

    if (!bookResponse.ok) {
      throw new Error(`Failed to fetch book: ${bookResponse.status}`);
    }

    const book = await bookResponse.json();

    // Update book status
    const bookUpdateResponse = await fetch(`${BASE_API}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...book,
        status: true, // Set book to available
        user_id: null, // Remove user association
      }),
    });

    if (!bookUpdateResponse.ok) {
      throw new Error(`Failed to update book: ${bookUpdateResponse.status}`);
    }

    // Update user history
    const userId = user.value.id;
    const userResponse = await fetch(`${BASE_API}/users/${userId}`);

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }

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

// Navigation method to borrow books
const navigateToBorrowBooks = () => {
  // Update this line to ensure it routes correctly with the user ID
  router.push(`/available-books/${user.value.id}`);
};

// Initial data fetch
onMounted(fetchUserData);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-8">
      My Profile
    </h1>

    <!-- Main content when data is loaded -->
    <div v-if="user" class="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <!-- User Profile Section -->
      <UserProfileHeader :user="user" />

      <!-- Currently Borrowed Books Section -->
      <div class="p-6 border-t border-gray-100">
        <BorrowedBooks
          :borrowed-books="currentlyBorrowed"
          :is-returning="returnLoading"
          :returning-book-id="returnBookId"
          @return-book="returnBook"
          @navigate-borrow="navigateToBorrowBooks"
        />
      </div>

      <!-- Borrowing History Section -->
      <div class="p-6 border-t border-gray-100">
        <BorrowingHistory :history="user.history" />
      </div>
    </div>

    <!-- Loading and Error States -->
    <LoadingAndErrorStates v-else :loading="loading" :error="error" />
  </div>
</template>
