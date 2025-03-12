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
    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
  >
    <div class="relative">
      <img
        v-if="book.image"
        :src="book.image"
        :alt="`Cover of ${book.name}`"
        class="w-full h-56 object-cover"
        :onerror="`this.src='${defaultAvatar}'`"
      />
      <div
        v-else
        class="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
      >
        <span class="text-gray-400 font-medium">No cover available</span>
      </div>
      <div class="absolute top-3 right-3">
        <span
          v-if="book.status"
          class="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border border-green-100"
        >
          Available
        </span>
        <span
          v-else
          class="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border border-red-100"
        >
          Borrowed
        </span>
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <h2 class="text-lg font-bold text-gray-800 line-clamp-1">
        {{ book.name }}
      </h2>
      <p class="text-gray-600 text-sm mb-3">
        by <span class="font-medium">{{ book.author }}</span>
      </p>

      <div class="mb-4">
        <span
          class="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"
        >
          {{ book.publishing_house }}
        </span>
      </div>

      <div class="mt-auto space-y-2">
        <router-link :to="`/books/${book.id}`" class="block">
          <button
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            View Details
          </button>
        </router-link>

        <div class="grid grid-cols-2 gap-2">
          <router-link :to="`/books/${book.id}/edit`" class="block">
            <button
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-3 rounded-lg transition-colors duration-200"
            >
              Edit
            </button>
          </router-link>
          <button
            @click="handleDelete"
            class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            :disabled="
              (isDeleting && deletingBookId === book.id) || !book.status
            "
            :class="[!book.status ? 'opacity-50 cursor-not-allowed' : '']"
            :title="
              !book.status
                ? 'Cannot delete books that are currently borrowed'
                : ''
            "
          >
            <div v-if="isDeleting && deletingBookId === book.id" class="mr-2">
              <div
                class="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
            <span>{{
              isDeleting && deletingBookId === book.id
                ? "Deleting..."
                : !book.status
                ? "Can't Delete"
                : "Delete"
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
