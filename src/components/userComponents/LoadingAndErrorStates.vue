<script>
export default {
  name: "LoadingAndErrorStates",
  props: {
    loading: Boolean,
    error: String,
  },
};
</script>

<template>
  <!-- Error State -->
  <div
    v-if="error"
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

  <!-- Loading State -->
  <div v-else-if="loading" class="max-w-md mx-auto mt-10 text-center p-6">
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
