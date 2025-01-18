<template>
    <div>
      <h1>Update Client</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
      
      <!-- Search for Client -->
      <div v-else>
        <form @submit.prevent="fetchClientDetails">
          <label for="search-username">Search Username:</label>
          <input type="text" id="search-username" v-model="searchUsername" placeholder="Enter username" />
          <button type="submit">Fetch Client</button>
        </form>
      </div>
  
      <!-- Edit Client Details -->
      <form v-if="client.username" @submit.prevent="updateClientDetails">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="client.username" readonly />
        </div>
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="client.name" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="client.email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="client.password" />
        </div>
        <button type="submit">Update Client</button>
      </form>
      
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "~/store/auth-store.js";
  
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const client = ref({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const searchUsername = ref("");
  const loading = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");
  
  // Fetch client details by username
  async function fetchClientDetails() {
    try {
      loading.value = true;
      const clientData = await authStore.fetchClientDetails(api, searchUsername.value);
      client.value = { ...clientData, password: "" }; // Initialize the form, password is blank
      errorMessage.value = "";
    } catch (error) {
      console.error("Error fetching client details:", error);
      client.value = {
        username: "",
        name: "",
        email: "",
        password: "",
      }; // Clear client form on error
      errorMessage.value = error?.message || "Failed to fetch client details.";
    } finally {
      loading.value = false;
    }
  }
  
  // Update client details
  async function updateClientDetails() {
    try {
      loading.value = true;
      const updatedClient = await authStore.updateClient(api, client.value.username, {
        name: client.value.name,
        email: client.value.email,
        password: client.value.password,
      });
      successMessage.value = `Client "${updatedClient.username}" updated successfully!`;
      errorMessage.value = "";
    } catch (error) {
      console.error("Error updating client:", error);
      successMessage.value = "";
      errorMessage.value = error?.message || "Failed to update client.";
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
});
  </script>
  
  <style scoped>
  .error {
    color: red;
    margin-top: 10px;
  }
  .success {
    color: green;
    margin-top: 10px;
  }
  form > div {
    margin-bottom: 15px;
  }
  button {
    margin-top: 10px;
  }
  </style>
  