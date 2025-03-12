<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search...",
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
  maxSuggestions: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["search"]);

const searchInput = ref("");
const showSuggestions = ref(false);
const activeSuggestionIndex = ref(-1);
const isSelecting = ref(false); // Track if we're selecting a suggestion

const filteredSuggestions = computed(() => {
  if (!searchInput.value) return [];

  return props.suggestions
    .filter((item) =>
      item.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .slice(0, props.maxSuggestions);
});

function handleSearch() {
  emit("search", searchInput.value);
  showSuggestions.value = false;
}

function selectSuggestion(suggestion) {
  isSelecting.value = true;
  searchInput.value = suggestion;
  handleSearch(); // Immediately search when selecting a suggestion
  showSuggestions.value = false;

  // Reset isSelecting after a short delay
  setTimeout(() => {
    isSelecting.value = false;
  }, 100);
}

function handleKeydown(e) {
  if (e.key === "Enter") {
    // When Enter is pressed and no suggestion is active
    if (activeSuggestionIndex.value < 0) {
      e.preventDefault();
      handleSearch();
      return;
    }
  }

  if (!filteredSuggestions.value.length) return;

  // Arrow down
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeSuggestionIndex.value =
      activeSuggestionIndex.value < filteredSuggestions.value.length - 1
        ? activeSuggestionIndex.value + 1
        : 0;
  }

  // Arrow up
  else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeSuggestionIndex.value =
      activeSuggestionIndex.value > 0
        ? activeSuggestionIndex.value - 1
        : filteredSuggestions.value.length - 1;
  }

  // Enter with active suggestion
  else if (e.key === "Enter" && activeSuggestionIndex.value >= 0) {
    e.preventDefault();
    selectSuggestion(filteredSuggestions.value[activeSuggestionIndex.value]);
  }

  // Escape
  else if (e.key === "Escape") {
    showSuggestions.value = false;
    activeSuggestionIndex.value = -1;
  }
}

function handleBlur() {
  // Only hide suggestions if we're not in the process of selecting an item
  if (!isSelecting.value) {
    setTimeout(() => {
      showSuggestions.value = false;
    }, 150);
  }
}

function handleFocus() {
  // Only show suggestions if we have input and we're not selecting an item
  if (searchInput.value && !isSelecting.value) {
    showSuggestions.value = true;
  }
}

// Modified: only update suggestions display, don't search automatically
watch(searchInput, () => {
  if (!isSelecting.value) {
    showSuggestions.value = !!searchInput.value;
    activeSuggestionIndex.value = -1;
  }
});
</script>

<template>
  <div class="relative">
    <div class="flex items-center">
      <input
        v-model="searchInput"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        @click="handleSearch"
        class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </div>

    <!-- Autocomplete suggestions -->
    <div
      v-if="showSuggestions && filteredSuggestions.length"
      class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
    >
      <ul>
        <li
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          :class="[
            'px-4 py-2 cursor-pointer hover:bg-gray-100',
            { 'bg-blue-100': index === activeSuggestionIndex },
          ]"
          @mousedown="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>
