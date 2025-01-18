<template>
    <div>
      <h1>Delete Client</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
      
      <!-- Search for Client -->
      <div v-else>
        <form @submit.prevent="deleteClient">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            v-model="usernameToDelete"
            placeholder="Enter username"
            required
          />
          <button type="submit">Delete Client</button>
        </form>
      </div>
  
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "~/store/auth-store.js";
  
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const usernameToDelete = ref("");
  const loading = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");
  
  // Function to delete the client
  async function deleteClient() {
    try {
      loading.value = true;
      await authStore.deleteClient(api, usernameToDelete.value);
      successMessage.value = `Client "${usernameToDelete.value}" deleted successfully!`;
      errorMessage.value = "";
      usernameToDelete.value = ""; // Clear the input field
    } catch (error) {
      console.error("Error deleting client:", error);
      successMessage.value = "";
      errorMessage.value = error?.message || "Failed to delete client.";
    } finally {
      loading.value = false;
    }
  }
  
  // Restore token on mounted
  onMounted(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      authStore.token = storedToken;
      console.log("Token restored from localStorage:", authStore.token);
      authStore.getUserInfo(api);
    }
  });
  </script>
  
  <style scoped>
  .success {
    color: green;
    margin-top: 10px;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  form > div {
    margin-bottom: 15px;
  }
  button {
    margin-top: 10px;
  }
  </style>
  