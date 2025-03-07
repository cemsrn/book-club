<script setup>
defineProps({
  publishers: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Top 5 Publishing Houses
    </h2>
    <div v-if="publishers.length === 0" class="text-gray-500 italic">
      No data available
    </div>
    <div v-else class="overflow-x-auto">
      <div class="flex bg-gray-50 border-b border-gray-200">
        <div
          class="w-1/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Rank
        </div>
        <div
          class="w-3/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Publisher
        </div>
        <div
          class="w-2/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Books Borrowed
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="(publisher, index) in publishers"
          :key="index"
          class="flex items-center hover:bg-gray-50"
        >
          <div class="w-1/6 px-3 py-3 whitespace-nowrap text-sm text-gray-800">
            {{ index + 1 }}
          </div>
          <div
            class="w-3/6 px-3 py-3 whitespace-nowrap text-sm text-gray-800 capitalize"
          >
            {{ publisher.name }}
          </div>
          <div class="w-2/6 px-3 py-3 whitespace-nowrap text-sm text-gray-800">
            {{ publisher.count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
