<template>
    <div v-if="admin">
      <h2>Details of {{ username }}</h2>
      {{ admin }}
    </div>
  
    <!-- <h2>Enrolled in:</h2>
    <div v-for="subject in student.subjects">
      {{ subject }}
    </div> -->
  
    <h2>Error messages:</h2>
    {{ messages }}
  </template>
  
  <script setup>
  const route = useRoute();
  const username = route.params.username;
  
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const { data: admin, error: adminErr } = await useFetch(
    `${api}/admin/${username}`
  );
  
  /*
  const { data: subjects, error: subjectsErr } = await useFetch(
    `${api}/student/${username}/subjects`
  );
  */
  
  const messages = ref([]);
  
  if (adminErr.value) messages.value.push(adminErr.value);
  //if (subjectsErr.value) messages.value.push(subjectsErr.value);
  </script>
  