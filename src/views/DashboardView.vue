<script setup>
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import BackToHome from "@/components/buttons/BackToHome.vue";
import { useRouter } from "vue-router";

// API and components
import getAllUsers from "@/api/Users/getAllUsers";
import getAllBooks from "@/api/Books/getAllBooks";
import LoadingIndicator from "@/components/dashboardComponents/LoadingIndicator.vue";
import StatisticsCard from "@/components/dashboardComponents/StatisticsCard.vue";
import WeeklyBorrowChart from "@/components/dashboardComponents/WeeklyBorrowChart.vue";
import TopPublishersTable from "@/components/dashboardComponents/TopPublishersTable.vue";
import TopLanguagesTable from "@/components/dashboardComponents/TopLanguagesTable.vue";
import TopBorrowersTable from "@/components/dashboardComponents/TopBorrowersTable.vue";

// Stats calculations
import useDashboardMetrics from "@/composables/useDashboardMetrics";
import usePublisherStatistics from "@/composables/usePublisherStatistics";
import useLanguageStatistics from "@/composables/useLanguageStatistics";
import useBorrowerStatistics from "@/composables/useBorrowerStatistics";
import useBorrowStatistics from "@/composables/useBorrowStatistics";

// Need this for charts to work
Chart.register(...registerables);

// Data
const users = ref([]);
const books = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const router = useRouter();

// Check if the user is in guest mode
const isGuest = computed(() => localStorage.getItem("guestMode") === "true");

// Use our stats helpers
const { totalMembers, borrowedLastWeek } = useDashboardMetrics(users, books);
const { topPublishers } = usePublisherStatistics(users);
const { topLanguages } = useLanguageStatistics(users);
const { topBorrowers, getUserName } = useBorrowerStatistics(users);
const { chartDates, chartBorrowCounts } = useBorrowStatistics(users);

// Load everything we need
onMounted(async () => {
  try {
    // Load both data sources at once
    const [usersList, booksList] = await Promise.all([
      getAllUsers(),
      getAllBooks(),
    ]);

    users.value = usersList;
    books.value = booksList;
  } catch (err) {
    console.error("Dashboard data error:", err);
    errorMessage.value = "Couldn't load dashboard data. Try refreshing?";
  } finally {
    isLoading.value = false;
  }
});

// Guest exit function
const exitGuestMode = () => {
  localStorage.removeItem("guestMode");
  router.push("/login");
};
</script>

<template>
  <div class="dashboard p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div v-if="isGuest" class="mb-6 bg-blue-100 p-4 rounded-md">
      <div class="flex justify-between items-center">
        <p class="text-blue-800">
          <strong>Guest Mode</strong> - You're viewing limited dashboard metrics
        </p>
        <button
          @click="exitGuestMode"
          class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Exit Guest Mode
        </button>
      </div>
    </div>

    <template v-if="!isGuest">
      <BackToHome />
      <br />
      <br />
    </template>

    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
      Book Club Dashboard
    </h1>

    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      {{ errorMessage }}
    </div>

    <LoadingIndicator v-if="isLoading" />

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Members Card - Available to all -->
        <StatisticsCard
          title="Total Members"
          :value="totalMembers"
          comparisonText="registered members"
          borderColor="border-blue-500"
        />

        <!-- Books Borrowed Last Week Card - Available to all -->
        <StatisticsCard
          title="Books Borrowed (Last Week)"
          :value="borrowedLastWeek"
          comparisonText="in the last 7 days"
          borderColor="border-indigo-500"
        />
      </div>

      <!-- Chart Section - Available to all -->
      <WeeklyBorrowChart
        :dates="chartDates"
        :borrowCounts="chartBorrowCounts"
      />

      <!-- Admin-only sections -->
      <template v-if="!isGuest">
        <!-- Top Publishers and Languages -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TopPublishersTable :publishers="topPublishers" />
          <TopLanguagesTable :languages="topLanguages" />
        </div>

        <!-- Top 10 Members -->
        <TopBorrowersTable :borrowers="topBorrowers" />
      </template>

      <!-- Guest message about restricted content -->
      <div v-else class="bg-gray-100 p-6 rounded-lg mt-6 text-center">
        <p class="text-gray-700">
          Sign in with an admin account to view additional statistics and
          metrics.
        </p>
      </div>
    </div>
  </div>
</template>
