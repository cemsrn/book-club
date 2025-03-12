<script setup>
import UserDetails from "@/components/userComponents/UserDetails.vue";
import { useRouter } from "vue-router";
import GoBack from "@/components/buttons/GoBack.vue";

const router = useRouter();
</script>

<template>
  <div>
    <GoBack />

    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">
      User Details
    </h1>
    <UserDetails />
  </div>
</template>
