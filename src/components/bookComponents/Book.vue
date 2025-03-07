<script setup>
import { ref } from "vue";
import defaultAvatar from "@/assets/images/default-avatar.svg";

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
  deletingBookId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(["delete"]);

function handleDelete() {
  emit("delete", props.book.id);
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200"
  >
    <div class="p-4">
      <div class="mb-4">
        <img
          v-if="book.image"
          :src="book.image"
          :alt="`Cover of ${book.name}`"
          class="w-full h-48 object-cover rounded-md"
          :onerror="`this.src='${defaultAvatar}'`"
        />
        <div
          v-else
          class="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center"
        >
          <span class="text-gray-500">No cover available</span>
        </div>
      </div>

      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        {{ book.name }}
      </h2>
      <p class="text-gray-700 mb-2">
        by <span class="font-medium">{{ book.author }}</span>
      </p>

      <div class="mt-3 flex items-center">
        <span
          class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          published by {{ book.publishing_house }}
        </span>
        <span
          v-if="book.available"
          class="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          Available
        </span>
        <span
          v-else
          class="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          Borrowed
        </span>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <router-link :to="`/books/${book.id}`" class="block">
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition duration-300"
          >
            Edit
          </button>
        </router-link>
        <button
          @click="handleDelete"
          class="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md transition duration-300 flex items-center justify-center"
          :disabled="isDeleting && deletingBookId === book.id"
        >
          <div v-if="isDeleting && deletingBookId === book.id" class="mr-1">
            <div class="relative h-4 w-4">
              <div
                class="rounded-full border-2 border-t-transparent border-white/25 animate-spin h-4 w-4"
              ></div>
              <div
                class="absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-2 border-l-2 border-white border-r-transparent border-b-transparent opacity-75"
              ></div>
            </div>
          </div>
          <span>{{
            isDeleting && deletingBookId === book.id ? "Deleting..." : "Delete"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
