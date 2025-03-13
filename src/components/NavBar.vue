<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { computed, watch } from "vue";
const { logout, isAuthenticated, user } = useAuth0();

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
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Book Club</h1>
          </div>
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
        <div class="flex items-center" v-if="isAuthenticated">
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
  </nav>
</template>
