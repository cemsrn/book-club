import { computed } from "vue";

export default function useDashboardMetrics(users, books) {
  const totalMembers = computed(() => users.value.length);

  const borrowedLastWeek = computed(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let count = 0;
    users.value.forEach((user) => {
      if (user.history && Array.isArray(user.history)) {
        user.history.forEach((entry) => {
          const borrowDate = new Date(entry.borrow_date);
          if (borrowDate >= oneWeekAgo) {
            count++;
          }
        });
      }
    });

    return count;
  });

  return {
    totalMembers,
    borrowedLastWeek,
  };
}
