<template>
    <div>
      <h1>Client Details</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-else-if="client">
        <p><strong>Username:</strong> {{ client.username }}</p>
        <p><strong>Name:</strong> {{ client.name }}</p>
        <p><strong>Email:</strong> {{ client.email }}</p>
      </div>
      <div v-else>
        <p>No client data available.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useAuthStore } from "~/store/auth-store.js";
  
  const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const client = ref(null);
  const loading = ref(false);
  const errorMessage = ref("");
  
  const routeParams = useRoute().params; // Get route params using Nuxt's `useRoute`
  const username = routeParams.username;
  
  async function fetchDetails() {
    try {
      loading.value = true;
      client.value = await authStore.fetchClientDetails(api, username);
      errorMessage.value = ""; // Clear any previous errors
    } catch (error) {
      console.error("Error fetching client details:", error);
      client.value = null;
  
      // Handle 404 Not Found
      if (error.response && error.response.status === 404) {
        errorMessage.value = "Client not found.";
      } else {
        errorMessage.value = error?.message || "Failed to fetch client details.";
      }
    } finally {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      authStore.token = storedToken;
      console.log("Token restored from localStorage:", authStore.token);
      authStore.getUserInfo(api);
    }
    fetchDetails(); // Fetch client details after restoring token
  });
  </script>
  
  <style scoped>
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  