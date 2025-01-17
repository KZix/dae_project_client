<template>
    <div>
      <h1>Dashboard</h1>
      <div v-if="token">
        <h2>Welcome, {{ user?.name || 'User' }}!</h2>
        <div>
          <h3>User Info:</h3>
          <pre>{{ user }}</pre>
        </div>
      </div>
      <div v-else>
        <h2>You are not logged in</h2>
        <nuxt-link to="/auth/login">
          <button>Login</button>
        </nuxt-link>
      </div>
    </div>
    <div>
        <!-- div para listar os produtos -->
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { useAuthStore } from "~/store/auth-store.js";
  
  // Get token and user references from the store
  const authStore = useAuthStore();
  const { token, user, getUserInfo } = authStore;
  
  onMounted(() => {
    // Check for token on mount
    if (!token && localStorage.getItem("token")) {
      token.value = localStorage.getItem("token");
      getUserInfo().catch((error) =>
        console.error("Failed to fetch user info:", error)
      );
    }
  });
  </script>
  