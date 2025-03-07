<script setup>
import { ref, onMounted, computed } from "vue";
import getAllUsers from "@/api/Users/getAllUsers.js";
import getCurrentlyBorrowed from "@/api/Users/getCurrentlyBorrowed.js";
import { useRouter } from "vue-router";
import User from "@/components/userComponents/User.vue";
import LoadMoreButton from "@/components/buttons/LoadMore.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BackToHome from "@/components/buttons/BackToHome.vue";

const router = useRouter();
const allUsers = ref([]);
const users = ref([]);
const userBooks = ref({});
const loading = ref(false);
const loadingMore = ref(false);
const usersPerPage = 8;
const currentCount = ref(0);

// For navigation
function goToHome() {
  router.push("/");
}

const hasMoreUsers = computed(() => currentCount.value < allUsers.value.length);

async function fetchUsers() {
  loading.value = true;

  try {
    // Get users first
    const data = await getAllUsers();
    allUsers.value = data;

    // Show initial batch
    currentCount.value = Math.min(usersPerPage, data.length);
    users.value = data.slice(0, currentCount.value);

    // Then get their books
    fetchBooksForUsers(users.value);
  } catch (err) {
    console.error("Error loading users:", err);
  } finally {
    loading.value = false;
  }
}

async function loadMoreUsers() {
  if (loadingMore.value || !hasMoreUsers.value) return;

  loadingMore.value = true;

  try {
    // Get the next batch
    const nextBatch = allUsers.value.slice(
      currentCount.value,
      currentCount.value + usersPerPage
    );

    // Update the display count first
    currentCount.value += nextBatch.length;
    users.value = allUsers.value.slice(0, currentCount.value);

    // Then fetch their books
    fetchBooksForUsers(nextBatch);
  } catch (err) {
    console.error("Error loading more users:", err);
  } finally {
    loadingMore.value = false;
  }
}

// Get borrowed books for each user, with a delay to avoid API rate limits
async function fetchBooksForUsers(usersList) {
  // Process users one by one to avoid rate limits
  for (const user of usersList) {
    try {
      // Add small delay between requests
      await new Promise((r) => setTimeout(r, 300));

      const books = await getCurrentlyBorrowed(user.id);
      userBooks.value[user.id] = books;
    } catch (err) {
      console.error(`Couldn't get books for user ${user.id}:`, err);
      userBooks.value[user.id] = [];
    }
  }
}

onMounted(fetchUsers);
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <BackToHome />
    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">Users</h1>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center mb-8">
      <LoadingSpinner size="md" text="Loading users..." />
    </div>

    <!-- Users Grid -->
    <div
      v-if="users.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
    >
      <User
        v-for="user in users"
        :key="user.id"
        :user="user"
        :books="userBooks[user.id] || []"
      />
    </div>

    <!-- Load More Button -->
    <LoadMoreButton
      v-if="hasMoreUsers && !loading"
      :is-loading="loadingMore"
      :has-more-items="hasMoreUsers"
      button-text="Show More Users"
      loading-text="Loading..."
      @load-more="loadMoreUsers"
    />

    <!-- User Count Display -->
    <div v-if="users.length && !loading" class="text-center text-gray-600 mt-4">
      Showing {{ currentCount }} of {{ allUsers.length }} users
    </div>
  </main>
</template>
