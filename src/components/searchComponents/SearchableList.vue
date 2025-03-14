<script setup>
import { ref, computed } from "vue";
import SearchBar from "./SearchBar.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  searchFields: {
    type: Array,
    default: () => ["name", "title"],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  searchPlaceholder: {
    type: String,
    default: "Search...",
  },
  maxSuggestions: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["update:search"]);
const searchTerm = ref("");

const filteredItems = computed(() => {
  if (!searchTerm.value) {
    return props.items;
  }

  const term = searchTerm.value.toLowerCase();

  return props.items.filter((item) => {
    return props.searchFields.some((field) => {
      if (item[field]) {
        return item[field].toLowerCase().includes(term);
      }
      return false;
    });
  });
});

// Generate search suggestions from all items
const suggestions = computed(() => {
  const allSuggestions = new Set();

  props.items.forEach((item) => {
    props.searchFields.forEach((field) => {
      if (item[field]) {
        allSuggestions.add(item[field]);
      }
    });
  });

  return Array.from(allSuggestions);
});

function handleSearch(value) {
  searchTerm.value = value;
  emit("update:search", value);
}
</script>

<template>
  <div>
    <div class="mb-6">
      <SearchBar
        :placeholder="searchPlaceholder"
        :suggestions="suggestions"
        :max-suggestions="maxSuggestions"
        @search="handleSearch"
      />
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="items.length === 0" class="p-8 text-center text-gray-500">
      <p>No items available.</p>
    </div>

    <div
      v-else-if="filteredItems.length === 0"
      class="p-8 text-center text-gray-500"
    >
      <p>No items match your search criteria.</p>
    </div>

    <slot :items="filteredItems"></slot>
  </div>
</template>
