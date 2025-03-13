<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { computed, watch, ref } from "vue";
const { logout, isAuthenticated, user } = useAuth0();

// Mobile menu state
const mobileMenuOpen = ref(false);

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Compute user role from Auth0 user data
const userRole = computed(() => {
  if (!user.value) return null;

  // Check for the exact property name from your post-login trigger
  if (user.value["app_metadata.role"]) {
    return user.value["app_metadata.role"];
  }

  // Keep the other checks as fallbacks
  // Check for the custom claim from your post-login trigger
  if (user.value.app_metadata && user.value.app_metadata.role) {
    return user.value.app_metadata.role;
  }

  // Auth0 sometimes namespaces custom claims with your Auth0 domain
  const auth0Domain = "your-auth0-domain"; // Replace with your actual Auth0 domain
  if (user.value[`https://${auth0Domain}/app_metadata`]?.role) {
    return user.value[`https://${auth0Domain}/app_metadata`].role;
  }

  // Check other common locations as fallbacks
  if (user.value.role) return user.value.role;

  // Check for role in a namespaced claim
  const namespace = "https://your-app-domain";
  if (
    user.value[`${namespace}/roles`] &&
    user.value[`${namespace}/roles`].length > 0
  ) {
    return user.value[`${namespace}/roles`][0];
  }

  // Another common location
  if (user.value.permissions && user.value.permissions.length > 0) {
    return user.value.permissions[0];
  }

  return "User"; // Default role if none found
});

// Define the logUserData function
const logUserData = () => {
  if (user.value) {
    console.log("Auth0 User Object:", JSON.stringify(user.value, null, 2));
  }
};

// Add a watcher to log whenever user changes
watch(user, logUserData, { immediate: true });

// Add the handleLogout function as well
const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};

const showAdminLinks = computed(() => {
  if (!user.value) return false;

  // Determine if user has admin role using existing role checks
  const role = userRole.value;
  return role === "admin";
});
</script>

<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and desktop navigation -->
        <div class="flex items-center">
          <!-- Desktop Navigation - hidden on mobile -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <!-- Member users only see profile link -->
            <router-link
              v-if="!showAdminLinks"
              to="/member-profile"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              My Profile
            </router-link>

            <!-- Admin users continue to see existing navigation -->
            <template v-if="showAdminLinks">
              <router-link
                to="/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </router-link>
              <!-- Keep all other existing admin navigation links -->
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed -->
            <svg
              v-if="!mobileMenuOpen"
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Icon when menu is open -->
            <svg
              v-else
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- User info and logout - desktop -->
        <div class="hidden sm:flex items-center" v-if="isAuthenticated">
          <div class="flex items-center space-x-2">
            <div class="flex flex-col items-end" v-if="user">
              <span class="text-sm text-gray-700">{{ user.name }}</span>
              <span class="text-xs text-gray-500">Role: {{ userRole }}</span>
            </div>
            <button
              @click="handleLogout"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on mobile menu state -->
    <div v-if="mobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <!-- Member users only see profile link -->
        <router-link
          v-if="!showAdminLinks"
          to="/member-profile"
          class="bg-gray-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          @click="mobileMenuOpen = false"
        >
          My Profile
        </router-link>

        <!-- Admin users continue to see existing navigation -->
        <template v-if="showAdminLinks">
          <router-link
            to="/"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>
          <!-- Keep all other existing admin navigation links -->
        </template>
      </div>

      <!-- User info and logout - mobile -->
      <div class="pt-4 pb-3 border-t border-gray-200" v-if="isAuthenticated">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div
              class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
            >
              <span class="text-gray-600 font-medium">{{
                user?.name?.charAt(0) || "U"
              }}</span>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">
              {{ user?.name }}
            </div>
            <div class="text-sm font-medium text-gray-500">
              Role: {{ userRole }}
            </div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
