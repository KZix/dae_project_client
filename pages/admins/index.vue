<template>
  <div>
    <div v-if="error"></div>
    <div v-else>
      <nuxt-link to="/admins/create">Create a New Admin</nuxt-link>
      <h2>Admins</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.username">
            <td>{{ admin.username }}</td>
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
    <div class="mt-4">
      <button @click="goTo('/produtos')" class="button">Lista de Produtos</button>
      <button @click="goTo('/volumes')" class="button">Lista de Volumes</button>
      <button @click="goTo('/encomendas')" class="button">Lista de Encomendas</button>
      <button @click="goTo('/user')" class="button">Lista de Clientes</button>
      <button @click="goTo('/user/create')" class="button">Criar Cliente</button>
      <button @click="goTo('/user/edit')" class="button">Editar Cliente</button>
      <button @click="goTo('/user/delete')" class="button">Eliminar Cliente</button>
    </div>

    <>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const admins = ref([]);
const error = ref(null);

const fetchAdmins = async () => {
  try {
    const response = await fetch('http://localhost:8080/academics/api/admins');
    if (!response.ok) {
      throw new Error(`Erro ao buscar admins: ${response.statusText}`);
    }
    admins.value = await response.json();
  } catch (err) {
    error.value = err.message;
  }
};

const refresh = () => {
  fetchAdmins();
};

const goTo = (path) => {
  router.push(path);
};

onMounted(fetchAdmins);
</script>

<style scoped>
.button {
  background: linear-gradient(90deg, #10B981, #22D3EE);
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  margin-right: 1rem;
}

.button:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #059669, #0E7490);
}
</style>