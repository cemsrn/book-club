import { computed } from "vue";

export default function useLanguageStatistics(users) {
  const topLanguages = computed(() => {
    const languageCounts = {};

    users.value.forEach((user) => {
      if (user.history && Array.isArray(user.history)) {
        user.history.forEach((entry) => {
          if (entry.language) {
            if (!languageCounts[entry.language]) {
              languageCounts[entry.language] = 0;
            }
            languageCounts[entry.language]++;
          }
        });
      }
    });

    return Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  return { topLanguages };
}
