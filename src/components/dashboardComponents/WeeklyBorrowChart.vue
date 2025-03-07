<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart } from "chart.js";

const props = defineProps({
  dates: {
    type: Array,
    required: true,
  },
  borrowCounts: {
    type: Array,
    required: true,
  },
});

const chartInstance = ref(null);

function createChart() {
  const canvas = document.getElementById("weeklyBorrowChart");
  if (canvas) {
    // Destroy any existing chart
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    // Create new chart
    chartInstance.value = new Chart(canvas, {
      type: "bar",
      data: {
        labels: props.dates,
        datasets: [
          {
            label: "Books Borrowed",
            data: props.borrowCounts,
            backgroundColor: "rgba(99, 102, 241, 0.6)",
            borderColor: "rgb(79, 70, 229)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Books",
            },
            ticks: {
              precision: 0,
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    });
  }
}

// Watch for changes in props to update the chart
watch(
  () => [props.dates, props.borrowCounts],
  () => {
    if (props.dates.length > 0 && props.borrowCounts.length > 0) {
      createChart();
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.dates.length > 0 && props.borrowCounts.length > 0) {
    createChart();
  }
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Books Borrowed (Last 7 Days)
    </h2>
    <div class="h-80">
      <canvas id="weeklyBorrowChart"></canvas>
    </div>
  </div>
</template>
