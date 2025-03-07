import { computed } from "vue";

export default function useBorrowStatistics(users) {
  const chartDates = computed(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(
        date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }
    return dates;
  });

  const chartBorrowCounts = computed(() => {
    const counts = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      let dayCount = 0;

      users.value.forEach((user) => {
        if (user.history && Array.isArray(user.history)) {
          user.history.forEach((entry) => {
            const borrowDate = new Date(entry.borrow_date);
            if (borrowDate >= date && borrowDate < nextDay) {
              dayCount++;
            }
          });
        }
      });

      counts.push(dayCount);
    }

    return counts;
  });

  return {
    chartDates,
    chartBorrowCounts,
  };
}
