import { computed } from "vue";

export default function usePublisherStatistics(users) {
  const topPublishers = computed(() => {
    const publisherCounts = {};

    users.value.forEach((user) => {
      if (user.history && Array.isArray(user.history)) {
        user.history.forEach((entry) => {
          if (entry.publishing_house) {
            if (!publisherCounts[entry.publishing_house]) {
              publisherCounts[entry.publishing_house] = 0;
            }
            publisherCounts[entry.publishing_house]++;
          }
        });
      }
    });

    return Object.entries(publisherCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  return { topPublishers };
}
