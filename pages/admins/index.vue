<template>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <nuxt-link to="/admins/create">Create a New Admin</nuxt-link>
      <h2>Admins</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <!-- <th>Name</th>
            <th>E-mail</th>
            <th>Course</th>
            <th>Actions</th>
            <th>Email</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins">
            <td>{{ admin.username }}</td>
            <!-- <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.courseName }}</td> -->
            <td>
              <nuxt-link :to="`/admins/${admin.username}`">Details</nuxt-link>
            </td>
            <td>
              <nuxt-link :to="`/admins/${admin.username}/send-email`">
                <button>Send Email</button>
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button @click.prevent="refresh">Refresh Data</button>
  </template>
  <script setup>
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  const { data: admins, error, refresh } = await useFetch(`${api}/admins`);
  </script>
  