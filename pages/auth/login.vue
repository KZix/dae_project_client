<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6 text-blue-800">Login Form</h1>
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input
          id="username"
          v-model="loginFormData.username"
          type="text"
          class="w-full px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          id="password"
          v-model="loginFormData.password"
          type="password"
          class="w-full px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <button
        @click="handleLogin"
        class="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
      >
        LOGIN
      </button>
      <div v-if="token" class="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
        <div><strong>Token:</strong> {{ token }}</div>
      </div>
      <div v-if="user" class="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
        <div>
          <strong>User:</strong>
          <pre>{{ user }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";

const config = useRuntimeConfig();
const api = config.public.API_URL;

const loginFormData = reactive({
  username: "",
  password: "",
});

const authStore = useAuthStore();
const { token, user } = storeToRefs(authStore);

async function handleLogin() {
  try {
    await authStore.login(api, loginFormData);
    console.log("Login successful");
  } catch (e) {
    console.error("Login failed:", e);
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
body {
  font-family: 'Inter', sans-serif;
}

h1 {
  font-size: 1.75rem;
}

input {
  border: 1px solid #D1D5DB; /* Gray border */
}

input:focus {
  border-color: #2563EB; /* Blue focus */
}
</style>