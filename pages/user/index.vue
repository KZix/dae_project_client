<template>
  <div>
    <h1>Clients</h1>
    <ul>
      <li v-for="(user, index) in users" :key="index">
        <strong>Username:</strong> {{ user.username }}<br>
        <strong>Name:</strong> {{ user.name }}<br>
        <strong>Email:</strong> {{ user.email }}<br>
        <hr>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";

const config = useRuntimeConfig();
const api = config.public.API_URL;

const authStore = useAuthStore();
const { users } = storeToRefs(authStore);

onMounted(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    authStore.token = storedToken;
    console.log("Token restored from localStorage:", authStore.token);
    authStore.getUserInfo(api);
  }
    authStore.getAllUsers(api);
  });
</script>
