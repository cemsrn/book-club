<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { useRouter } from "vue-router";

const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();
const router = useRouter();

const login = () => {
  loginWithRedirect({
    authorizationParams: {
      screen_hint: "login",
    },
  });
};

const signup = () => {
  loginWithRedirect({
    authorizationParams: {
      screen_hint: "signup",
    },
  });
};

const guestAccess = () => {
  console.log("Setting guest mode and navigating");
  // Set guest mode in localStorage so we can check it later
  localStorage.setItem("guestMode", "true");

  // Use window.location instead of router.push to force a full page reload
  window.location.href = window.location.origin + "/dashboard";
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Book Club</h1>
        <p class="mt-2 text-sm text-gray-600">Sign in to access Book Club</p>
      </div>

      <div v-if="isLoading" class="flex justify-center">
        <div
          class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <div v-else class="flex flex-col space-y-4">
        <button
          @click="login"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign In
        </button>

        <button
          @click="signup"
          class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Sign Up
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          @click="guestAccess"
          class="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
</template>
