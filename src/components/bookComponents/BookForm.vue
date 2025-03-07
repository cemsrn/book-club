<script setup>
import { computed } from "vue";

const props = defineProps({
  book: {
    type: Object,
    required: true,
    default: () => ({
      name: "",
      image: "",
      language: "",
      isbn: "",
      price: "",
      author: "",
      publishing_house: "",
      status: false,
    }),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "add",
    validator: (value) => ["add", "edit"].includes(value),
  },
});

const emit = defineEmits(["submit", "cancel"]);

const isEditMode = computed(() => props.mode === "edit");
const buttonText = computed(() => {
  if (props.isLoading) {
    return isEditMode.value ? "Saving..." : "Adding Book...";
  }
  return isEditMode.value ? "Save Changes" : "Add New Book";
});

const buttonClass = computed(() => {
  return isEditMode.value
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-green-600 hover:bg-green-700";
});

const handleSubmit = () => {
  emit("submit");
};

const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white shadow-md rounded-lg p-6"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Book Image Preview -->
      <div class="md:col-span-2 flex justify-center mb-4">
        <img
          :src="book.image"
          :alt="book.name || 'Book cover preview'"
          class="h-64 object-cover rounded-md shadow-md"
        />
      </div>

      <!-- Book Title -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Book Title
        </label>
        <input
          id="name"
          v-model="book.name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Book Title"
          required
        />
      </div>

      <!-- Author -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="author">
          Author
        </label>
        <input
          id="author"
          v-model="book.author"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Author Name"
          required
        />
      </div>

      <!-- Image URL -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
          Cover Image URL
        </label>
        <input
          id="image"
          v-model="book.image"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          :placeholder="
            mode === 'add' ? 'https://example.com/book-cover.jpg' : ''
          "
        />
      </div>
    </div>

    <!-- Publishing House -->
    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="publishing_house"
      >
        Publishing House
      </label>
      <input
        id="publishing_house"
        v-model="book.publishing_house"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Publishing House"
      />
    </div>

    <!-- ISBN -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="isbn">
        ISBN
      </label>
      <input
        id="isbn"
        v-model="book.isbn"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        :placeholder="
          mode === 'add' ? 'ISBN (will be generated if empty)' : 'ISBN'
        "
      />
    </div>

    <!-- Language -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="language">
        Language
      </label>
      <input
        id="language"
        v-model="book.language"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="EN, ES, FR, etc."
      />
    </div>

    <!-- Price -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
        Price
      </label>
      <input
        id="price"
        v-model="book.price"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        step="0.01"
        min="0"
        placeholder="29.99"
      />
    </div>

    <!-- Status - Only show in Add mode -->
    <div v-if="mode === 'add'" class="mb-4 flex items-center">
      <input
        id="status"
        v-model="book.status"
        type="checkbox"
        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label class="ml-2 text-sm font-medium text-gray-700" for="status">
        Available for borrowing
      </label>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex justify-end">
      <button
        type="submit"
        :class="[
          buttonClass,
          'text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:shadow-outline transition duration-300 flex items-center',
        ]"
        :disabled="isLoading"
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
        {{ buttonText }}
      </button>
    </div>
  </form>
</template>
