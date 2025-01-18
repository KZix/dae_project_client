<template>
  <div>
    <h1 class="text-center text-3xl font-bold text-blue-900 mb-6">
      Lista de Volumes
    </h1>
    <table class="volumes-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Danificado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="volume in volumes" :key="volume.id">
          <td>
            <!-- Navegar dinamicamente para /volumes/:volumeId -->
            <nuxt-link :to="`/volumes/${volume.id}`" class="link-id">
              {{ volume.id }}
            </nuxt-link>
          </td>
          <td>{{ volume.descricao }}</td>
          <td>{{ volume.danificado === 1 ? "Sim" : "Não" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const volumes = ref([]);

const fetchVolumes = async () => {
  try {
    const response = await fetch("http://localhost:8080/academics/api/volumes");
    if (!response.ok) {
      throw new Error(`Erro ao buscar volumes: ${response.status}`);
    }
    volumes.value = await response.json();
  } catch (error) {
    console.error("Erro:", error.message);
  }
};


// Buscar detalhes do volume com base no ID
const fetchVolumeDetails = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/academics/api/volumes/${id}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar volume: ${response.statusText}`);
    }
    selectedVolume.value = await response.json();
  } catch (error) {
    console.error('Erro ao carregar detalhes do volume:', error.message);
    selectedVolume.value = null;
  }
};

onMounted(fetchVolumes);
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

.volumes-table {
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.volumes-table thead {
  background: linear-gradient(135deg, #1E3A8A, #2563EB);
  color: #ffffff;
}

.volumes-table th,
.volumes-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 1rem;
}

.volumes-table tbody tr:nth-child(odd) {
  background-color: #F9FAFB;
}

.volumes-table tbody tr:nth-child(even) {
  background-color: #EFF6FF;
}

.volumes-table tbody tr:hover {
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
