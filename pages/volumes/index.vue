<template>
    <div>
      <h1 class="text-center text-3xl font-bold text-blue-900 mb-6">Lista de Volumes</h1>
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
      <div class="mt-4">
        <button @click="goBack" class="button">Voltar para Admins</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const volumes = ref([]);
  
  const fetchVolumes = async () => {
    try {
      const response = await fetch('http://localhost:8080/academics/api/volumes');
      if (!response.ok) {
        throw new Error(`Erro ao buscar volumes: ${response.status}`);
      }
      volumes.value = await response.json();
    } catch (error) {
      console.error('Erro:', error.message);
    }
  };
  
  const goBack = () => {
    router.push('/admins');
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