<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToUsers = () => {
  router.push("/users");
};
const navigateToBooks = () => {
  router.push("/books");
};
const navigateToDashboard = () => {
  router.push("/dashboard");
};

const navCards = [
  {
    title: "Users",
    icon: "👥",
    accentColor: "bg-blue-400",
    action: navigateToUsers,
  },
  {
    title: "Books",
    icon: "📚",
    accentColor: "bg-green-400",
    action: navigateToBooks,
  },
  {
    title: "Dashboard",
    icon: "📊",
    accentColor: "bg-slate-400",
    action: navigateToDashboard,
  },
];
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <section
      class="min-h-screen flex flex-col gap-y-16 items-center justify-center"
    >
      <h1
        class="cursor-default text-5xl md:text-7xl text-center text-blue-700 mb-8"
      >
        Book Club
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        <div
          v-for="(card, index) in navCards"
          :key="index"
          @click="card.action"
          class="transition-all duration-300 transform hover:z-10 hover:scale-110 hover:shadow-xl rounded-xl flex overflow-hidden bg-white shadow-lg cursor-pointer"
        >
          <div :class="[card.accentColor, 'w-4 h-full']"></div>
          <div class="p-6 flex items-center">
            <div class="text-4xl mr-4">{{ card.icon }}</div>
            <h2 class="text-xl font-semibold text-gray-800">
              {{ card.title }}
            </h2>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
