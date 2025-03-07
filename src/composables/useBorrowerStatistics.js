import { computed } from "vue";

export default function useBorrowerStatistics(users) {
  const topBorrowers = computed(() => {
    const borrowerCounts = {};

    users.value.forEach((user) => {
      if (user.history && Array.isArray(user.history)) {
        borrowerCounts[user.id] = {
          id: user.id,
          count: user.history.length,
          name: user.name,
        };
      }
    });

    return Object.values(borrowerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  });

  function getUserName(userId) {
    const user = users.value.find((user) => user.id == userId);
    return user ? user.name : `User ${userId}`;
  }

  return {
    topBorrowers,
    getUserName,
  };
}
