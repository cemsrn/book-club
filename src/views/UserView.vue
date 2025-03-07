<script setup>
import UserDetails from "@/components/userComponents/UserDetails.vue";
import { useRouter } from "vue-router";
import BackToHome from "@/components/buttons/BackToHome.vue";

const router = useRouter();
const goToHome = () => {
  router.push("/");
};
</script>

<template>
  <div>
    <BackToHome />
    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">
      User Details
    </h1>
    <UserDetails />
  </div>
</template>
