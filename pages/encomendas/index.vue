<template>
  <div>
    <h1 class="text-center text-3xl font-bold text-blue-900 mb-6">Lista de Encomendas</h1>
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
            <nuxt-link :to="`/encomendas/${encomenda.id}`" class="link-id">
              {{ encomenda.id }}
            </nuxt-link>
          </td>
          <td>{{ encomenda.clienteUsername }}</td>
          <td>{{ getEstadoText(encomenda.estado) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
      <button @click="goBack" class="button">Voltar para Admins</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const encomendas = ref([]);

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

const getEstadoText = (estado) => {
  switch (estado) {
    case 0:
      return 'Pendente';
    case 1:
      return 'Enviado';
    case 2:
      return 'Recebido';
    default:
      return 'Desconhecido';
  }
};

const goBack = () => {
  router.push('/admins');
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
  padding: 12px 15px;
  text-align: left;
}

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
}

.button:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #059669, #0E7490);
}
</style>