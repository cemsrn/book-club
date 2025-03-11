<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search...",
  },
});

const emit = defineEmits(["search"]);
const searchText = ref("");

function clearSearch() {
  searchText.value = "";
  emit("search", "");
}

function updateSearch() {
  emit("search", searchText.value);
}
</script>

<template>
  <div class="relative">
    <input
      v-model="searchText"
      type="text"
      :placeholder="placeholder"
      class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      @input="updateSearch"
    />
    <button
      v-if="searchText"
      @click="clearSearch"
      type="button"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        />
      </svg>
    </button>
  </div>
</template>
