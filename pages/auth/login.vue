<template>
  <h1>Login Form</h1>
  <div>Username: <input v-model="loginFormData.username" /></div>
  <div>Password: <input v-model="loginFormData.password" /></div>
  <button @click="handleLogin">LOGIN</button>
  <button @click="reset">RESET</button>
  <div v-if="token">
    <div>Token: {{ token }}</div>
  </div>
  <div v-if="user">
    <div>
      User:
      <pre>{{ user }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "~/store/auth-store.js";

const config = useRuntimeConfig();
const api = config.public.API_URL;

const loginFormData = reactive({
  username: "",
  password: "",
});

const authStore = useAuthStore();
const { token, user } = storeToRefs(authStore);

function reset() {
  authStore.logout();
}

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
