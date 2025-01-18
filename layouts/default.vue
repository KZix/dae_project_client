<script setup>
import { useAuthStore } from "~/store/auth-store.js";
const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();
  router.push("/");
}
</script>

<template>
  <nav class="bg-blue-900 text-white py-4">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo or Brand Name -->
      <h1 class="text-2xl font-bold">UGANDA Management</h1>

      <!-- Navigation Links -->
      <div class="flex space-x-6">
        <nuxt-link
          to="/auth/login"
          class="hover:text-blue-300 transition-colors duration-300"
        >
          Login
        </nuxt-link>
        <nuxt-link
          to="/admins"
          class="hover:text-blue-300 transition-colors duration-300"
        >
          Admins
        </nuxt-link>
        <nuxt-link
          to="/dashboard"
          class="hover:text-blue-300 transition-colors duration-300"
        >
          Dashboard
        </nuxt-link>

        <!-- Logout Button: Visible only if logged in -->
        <a
          v-if="authStore.isLoggedIn"
          href="#"
          @click.prevent="logout"
          class="hover:text-red-400 transition-colors duration-300"
        >
          Logout
        </a>
      </div>
    </div>
  </nav>

  <!-- Slot for Content Below Navbar -->
  <div>
    <slot />
  </div>
</template>
<style>
nav {
  background-color: #1E3A8A;
}

nav h1 {
  font-size: 1.5rem;
  font-weight: bold;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #3B82F6; /* Lighter Blue */
}

nav a:last-child:hover {
  color: #EF4444; /* Red for Logout */
}
</style>