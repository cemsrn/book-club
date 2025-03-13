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

// Edit mode state
const isEditing = ref(false);
const editName = ref("");
const editLocation = ref("");

// Begin editing user profile
const startEditing = () => {
  editName.value = user.value.name;
  editLocation.value = user.value.location;
  isEditing.value = true;
};

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false;
};

// Save user profile changes
const saveUserChanges = async () => {
  try {
    if (!user.value || !user.value.id) {
      throw new Error("User information not available");
    }

    loading.value = true;
    const BASE_API = import.meta.env.VITE_BASE_API;
    const userResponse = await fetch(`${BASE_API}/users/${user.value.id}`);

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Update with edited data
    const userUpdateResponse = await fetch(
      `${BASE_API}/users/${user.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          name: editName.value,
          location: editLocation.value,
        }),
      }
    );

    if (!userUpdateResponse.ok) {
      throw new Error(`Failed to update user: ${userUpdateResponse.status}`);
    }

    // Refresh user data
    await fetchUserData();
    isEditing.value = false;
  } catch (err) {
    error.value = `Failed to update profile: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

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
      <div class="p-6">
        <div v-if="!isEditing">
          <UserProfileHeader :user="user" />
          <div class="mt-4 text-right">
            <button
              @click="startEditing"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div v-else class="p-4 bg-gray-50 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1" for="name">Name</label>
            <input
              id="name"
              v-model="editName"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1" for="location"
              >Location</label
            >
            <input
              id="location"
              v-model="editLocation"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="cancelEditing"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              @click="saveUserChanges"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              :disabled="loading"
            >
              {{ loading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
      </div>

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
