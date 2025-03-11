<script>
import { getUserById } from "@/api/Users/getUserData";
import defaultAvatar from "@/assets/images/default-avatar.svg";

export default {
  name: "UserDetails",
  data() {
    return {
      user: null,
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchUserData();
  },
  watch: {
    "$route.params.id": "fetchUserData",
  },
  methods: {
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
    formatDate(dateString) {
      if (!dateString) return "N/A";

      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<template>
  <div v-if="user" class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <div class="flex-shrink-0">
        <img
          :src="user.avatar"
          :alt="user.name"
          class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
          onerror="this.src={{ defaultAvatar }}"
        />
      </div>

      <div class="flex-grow">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ user.name }}</h1>
        <p class="text-gray-600 mb-3">
          <span class="inline-block mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
          {{ user.email }}
        </p>

        <div class="mb-3">
          <span
            :class="[
              'inline-block px-3 py-1 rounded-full text-sm font-medium',
              user.status
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800',
            ]"
          >
            {{ user.status ? "Active" : "Inactive" }}
          </span>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700"
        >
          <p class="flex items-center">
            <span class="inline-block mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
            Member since: {{ formatDate(user.createdAt) }}
          </p>
          <p class="flex items-center">
            <span class="inline-block mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
            {{ user.point }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h2
        class="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200"
      >
        Borrowing History
      </h2>

      <div v-if="user.history && user.history.length > 0" class="space-y-4">
        <div
          v-for="(item, index) in user.history"
          :key="index"
          :class="[
            'bg-gray-50 p-4 rounded-lg border',
            item.status === 'borrowed' ? 'border-blue-300' : 'border-gray-200',
          ]"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">
              <router-link
                :to="`/books/${item.book_id}`"
                class="text-blue-700 hover:text-blue-900 hover:underline"
              >
                {{ item.book_name }}
              </router-link>
            </h3>
            <span
              :class="[
                'inline-block px-3 py-1 rounded-full text-sm font-medium',
                item.status === 'borrowed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800',
              ]"
            >
              {{
                item.status === "borrowed" ? "Currently Borrowed" : "Returned"
              }}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p class="text-gray-700">
              <span class="font-medium">Author:</span> {{ item.author }}
            </p>
            <p class="text-gray-700">
              <span class="font-medium">Publisher:</span>
              {{ item.publishing_house }}
            </p>
            <p class="text-gray-700">
              <span class="font-medium">Book ID:</span> {{ item.book_id }}
            </p>
            <p class="text-gray-700">
              <span class="font-medium">Borrowed on:</span>
              {{ formatDate(item.borrow_date) }}
            </p>
            <p
              v-if="item.status === 'returned'"
              class="text-gray-700 col-span-2"
            >
              <span class="font-medium">Returned on:</span>
              {{ formatDate(item.return_date) }}
            </p>
          </div>
        </div>
      </div>

      <p v-else class="text-gray-500 italic py-4">
        This user has not borrowed any books yet.
      </p>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="max-w-md mx-auto mt-10 p-4 bg-red-50 rounded-lg border border-red-200 text-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-10 w-10 text-red-500 mx-auto mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p class="text-red-600">{{ error }}</p>
  </div>

  <div v-else class="max-w-md mx-auto mt-10 text-center p-6">
    <svg
      class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p class="text-gray-600">Loading user details...</p>
  </div>
</template>
