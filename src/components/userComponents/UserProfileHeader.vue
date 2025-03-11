<script setup>
import defaultAvatar from "@/assets/images/default-avatar.svg";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <!-- User Profile Header Section -->
  <div class="flex flex-col md:flex-row gap-8 mb-8">
    <div class="flex-shrink-0">
      <img
        :src="user.avatar"
        :alt="user.name"
        class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
        :onerror="`this.src='${defaultAvatar}'`"
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
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
          {{ user.location }}
        </p>
      </div>
    </div>
  </div>
</template>
