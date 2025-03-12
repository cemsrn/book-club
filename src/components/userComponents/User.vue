<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const viewUserDetails = () => {
  router.push(`/users/${props.user.id}`);
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200 flex flex-col h-full"
  >
    <!-- Card Header with Avatar -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <img
            :src="user.avatar"
            :alt="`${user.name}'s avatar`"
            class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            onerror="this.src='https://via.placeholder.com/150?text=User'"
          />
        </div>
        <div class="ml-4 overflow-hidden">
          <h2 class="text-xl font-semibold text-gray-800 truncate">
            {{ user.name }}
          </h2>
          <p class="text-sm text-gray-600 truncate">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <!-- User ID -->
      <div class="mb-3">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">ID</p>
            <p class="text-sm text-gray-500">{{ user.id }}</p>
          </div>
        </div>
      </div>

      <!-- Location Information -->
      <div v-if="user.location || user.address?.city" class="mb-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Location</p>
            <p class="text-sm text-gray-500">
              {{ user.location || (user.address && user.address.city) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="viewUserDetails"
        class="w-full mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
      >
        <span>View Details</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
