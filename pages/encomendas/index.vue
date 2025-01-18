<template>
  <div>
    <h1 class="text-center text-3xl font-bold text-blue-900 mb-6">
      Lista de Encomendas
    </h1>

    <table class="encomendas-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="encomenda in encomendas" :key="encomenda.id">
          <td>
            <!-- Navegar dinamicamente para /encomendas/:encomendaId -->
            <nuxt-link :to="`/encomendas/${encomenda.id}`" class="link-id">
              {{ encomenda.id }}
            </nuxt-link>
          </td>
          <td>{{ encomenda.clienteUsername }}</td>
          <td>{{ encomenda.estado }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const encomendas = ref([]);

// Buscar a lista de encomendas da API
const fetchEncomendas = async () => {
  try {
    const response = await fetch('http://localhost:8080/academics/api/encomendas');
    if (!response.ok) {
      throw new Error(`Erro ao buscar encomendas: ${response.status}`);
    }
    encomendas.value = await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
  }
};

onMounted(fetchEncomendas);
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

.encomendas-table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.encomendas-table thead {
  background: linear-gradient(135deg, #1E3A8A, #2563EB);
  color: #ffffff;
}

.encomendas-table th,
.encomendas-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 1rem;
}

.encomendas-table tbody tr:nth-child(odd) {
  background-color: #F9FAFB;
}

.encomendas-table tbody tr:nth-child(even) {
  background-color: #EFF6FF;
}

.encomendas-table tbody tr:hover {
  background-color: #DBEAFE;
}

.link-id {
  color: #2563EB;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-id:hover {
  color: #1E3A8A;
}
</style>