import "./main.css";
import { createAuth0 } from "@auth0/auth0-vue";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  })
);

app.use(router);

// Centralized auth & role-based navigation handling
router.beforeEach(async (to, from, next) => {
  // Always allow access to login page
  if (to.path === "/login") {
    return next();
  }

  // Check if user is accessing as guest
  const isGuest = localStorage.getItem("guestMode") === "true";

  // If accessing dashboard as guest, allow it and skip all other checks
  if (isGuest && to.path === "/dashboard") {
    return next();
  }

  // For all other routes, apply normal authentication

  // Access Auth0 through global properties
  const auth0 = app.config.globalProperties.$auth0;

  // Wait for Auth0 to initialize if needed
  if (auth0.isLoading.value) {
    try {
      // Wait for Auth0 loading to complete (max 2 seconds)
      await new Promise((resolve, reject) => {
        const checkAuth = () => {
          if (!auth0.isLoading.value) {
            resolve();
          } else if ((tries += 1) > 20) {
            reject(new Error("Auth0 initialization timeout"));
          } else {
            setTimeout(checkAuth, 100);
          }
        };
        let tries = 0;
        checkAuth();
      });
    } catch (error) {
      console.error("Auth0 initialization error:", error);
      return next("/login");
    }
  }

  // Handle unauthenticated users - redirect to login
  if (!auth0.isAuthenticated.value) {
    return next("/login");
  }

  // User is authenticated - handle role-based access
  const user = auth0.user.value;
  console.log("Auth0 User:", user);

  // Check if user is admin
  const isAdmin = user && user["app_metadata.role"] === "admin";
  console.log("Is Admin:", isAdmin);

  // Special case: Just logged in (coming from login page)
  if (from.path === "/login") {
    if (isAdmin) {
      // Admin goes to home/dashboard
      return next(to.path === "/login" ? "/" : to.path);
    } else {
      // Members go to profile page regardless of requested path
      return next("/member-profile");
    }
  }

  // Normal navigation (not from login)
  if (to.meta.requiresAdmin && !isAdmin) {
    // Non-admins trying to access admin pages get redirected to profile
    return next("/member-profile");
  }

  // All other cases - proceed with navigation
  return next();
});

app.mount("#app");
