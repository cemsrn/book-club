<script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  hasMoreItems: {
    type: Boolean,
    default: true,
  },
  loadingText: {
    type: String,
    default: "Loading...",
  },
  buttonText: {
    type: String,
    default: "Load More",
  },
});

const emit = defineEmits(["loadMore"]);

function handleClick() {
  if (!props.isLoading && props.hasMoreItems) {
    emit("loadMore");
  }
}
</script>

<template>
  <div class="flex justify-center mt-8 mb-4">
    <button
      @click="handleClick"
      class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
      :disabled="isLoading || !hasMoreItems"
    >
      <span v-if="isLoading" class="mr-2">
        <svg
          class="animate-spin h-5 w-5 text-white"
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
      </span>
      {{ isLoading ? loadingText : buttonText }}
    </button>
  </div>
</template>
