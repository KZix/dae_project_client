<template>
  <div>
    <h1>Users</h1>
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
const { token, users } = storeToRefs(authStore);

onMounted(() => {
    authStore.getAllUsers(api);
  });
</script>
