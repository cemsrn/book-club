<script>
export default {
  name: "BorrowingHistory",
  props: {
    history: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    sortedHistory() {
      if (!this.history) return [];
      // Sort by borrow date, newest first
      return [...this.history].sort((a, b) => {
        return new Date(b.borrow_date) - new Date(a.borrow_date);
      });
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<template>
  <div>
    <h2
      class="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200"
    >
      Borrowing History
    </h2>

    <div v-if="history && history.length > 0" class="space-y-4">
      <div
        v-for="(item, index) in sortedHistory"
        :key="index"
        :class="[
          'bg-gray-50 p-4 rounded-lg border',
          item.status === 'borrowed' ? 'border-blue-300' : 'border-gray-200',
        ]"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold">
            <router-link
              :to="`/books/${item.book_id}`"
              class="text-blue-700 hover:text-blue-900 hover:underline"
            >
              {{ item.book_name }}
            </router-link>
          </h3>
          <span
            :class="[
              'inline-block px-3 py-1 rounded-full text-sm font-medium',
              item.status === 'borrowed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800',
            ]"
          >
            {{ item.status === "borrowed" ? "Currently Borrowed" : "Returned" }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <p class="text-gray-700">
            <span class="font-medium">Author:</span> {{ item.author }}
          </p>
          <p class="text-gray-700">
            <span class="font-medium">Publisher:</span>
            {{ item.publishing_house }}
          </p>
          <p class="text-gray-700">
            <span class="font-medium">Book ID:</span> {{ item.book_id }}
          </p>
          <p class="text-gray-700">
            <span class="font-medium">Borrowed on:</span>
            {{ formatDate(item.borrow_date) }}
          </p>
          <p v-if="item.status === 'returned'" class="text-gray-700 col-span-2">
            <span class="font-medium">Returned on:</span>
            {{ formatDate(item.return_date) }}
          </p>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 italic py-4">
      This user has not borrowed any books yet.
    </p>
  </div>
</template>
