<template>
    <div>
      <h1>Create New User</h1>
      <form @submit.prevent="createUserHandler">
        <div>
          <label for="username">Username:</label>
          <input v-model="form.username" type="text" id="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="form.password" type="password" id="password" required />
        </div>
        <div>
          <label for="name">Name:</label>
          <input v-model="form.name" type="text" id="name" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input v-model="form.email" type="email" id="email" required />
        </div>
        <button type="submit">Create User</button>
      </form>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, onMounted } from "vue";
  import { useAuthStore } from "~/store/auth-store.js";
  
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const form = reactive({
    username: "",
    password: "",
    name: "",
    email: "",
  });
  
  const successMessage = ref("");
  const errorMessage = ref("");
  
  async function createUserHandler() {
    try {
      const createdUser = await authStore.createUser(api, form);
  
      successMessage.value = `User "${createdUser.username}" created successfully!`;
      errorMessage.value = ""; // Clear any previous error message
  
      // Clear form
      form.username = "";
      form.password = "";
      form.name = "";
      form.email = "";
    } catch (error) {
      console.error("Failed to create user:", error);
      successMessage.value = "";
      errorMessage.value = error?.message || "Failed to create user.";
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