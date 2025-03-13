<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import LoginView from "@/views/LoginView.vue";
import NavBar from "@/components/NavBar.vue";

const { isAuthenticated, isLoading, user } = useAuth0();
const route = useRoute();

// Add this computed property to check for guest mode
const isGuest = computed(() => localStorage.getItem("guestMode") === "true");

// Compute user role from Auth0 user data (keep this for UI purposes)
const userRole = computed(() => {
  if (!user.value) return null;

  if (user.value["app_metadata.role"]) {
    return user.value["app_metadata.role"];
  }

  if (user.value.app_metadata && user.value.app_metadata.role) {
    return user.value.app_metadata.role;
  }

  return "member"; // Default role
});
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
    <div
      class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>

  <div v-else>
    <!-- check for guest mode too -->
    <template
      v-if="isAuthenticated || (isGuest && route.path === '/dashboard')"
    >
      <!-- Only show NavBar for authenticated users, not guests -->
      <NavBar v-if="isAuthenticated" />
      <RouterView />
    </template>

    <template v-else-if="route.path === '/login'">
      <!-- Login page without NavBar -->
      <RouterView />
    </template>

    <template v-else>
      <!-- Redirect unauthenticated users to login -->
      <LoginView />
    </template>
  </div>
</template>
