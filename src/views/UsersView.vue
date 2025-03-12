<script setup>
import { ref, onMounted } from "vue";
import getAllUsers from "@/api/Users/getAllUsers.js";
import { useRouter } from "vue-router";
import User from "@/components/userComponents/User.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BackToHome from "@/components/buttons/BackToHome.vue";
import SearchableList from "@/components/searchComponents/SearchableList.vue";

const router = useRouter();
const allUsers = ref([]);
const loading = ref(false);

// For navigation
function goToHome() {
  router.push("/");
}

async function fetchUsers() {
  loading.value = true;

  try {
    // Get all users
    const data = await getAllUsers();
    allUsers.value = data;
  } catch (err) {
    console.error("Error loading users:", err);
  } finally {
    loading.value = false;
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

    <div v-else>
      <!-- Search functionality -->
      <SearchableList
        :items="allUsers"
        :search-fields="['name', 'email', 'location']"
        :loading="loading"
        search-placeholder="Search users by name, email or location..."
        :max-suggestions="5"
        v-slot="{ items: filteredItems }"
        class="mb-6"
      >
        <template v-if="filteredItems && filteredItems.length > 0">
          <!-- Search results count notification -->
          <div v-if="filteredItems !== allUsers" class="mb-4 text-center">
            <p class="text-blue-700">
              {{ filteredItems.length }} matching users found
            </p>
          </div>

          <!-- Users Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            <User v-for="user in filteredItems" :key="user.id" :user="user" />
          </div>

          <!-- User Count Display -->
          <div class="text-center text-gray-600 mt-4">
            <span v-if="filteredItems !== allUsers">
              Showing {{ filteredItems.length }} filtered results
            </span>
            <span v-else> Showing all {{ allUsers.length }} users </span>
          </div>
        </template>
      </SearchableList>
    </div>
  </main>
</template>
