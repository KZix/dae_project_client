<template>
    <div class="card">
      <h1 class="text-2xl font-bold text-blue-900 mb-4">
        Detalhes do Volume
      </h1>
  
      <div v-if="loading" class="text-gray-500">Carregando...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <p><strong>ID:</strong> {{ volume.id }}</p>
        <p><strong>Descrição:</strong> {{ volume.descricao }}</p>
        <p><strong>Danificado:</strong>{{ volume.danificado === 1 ? 'Sim' : 'Não' }}</p>
        <button @click="goBack" class="button">Voltar para Lista</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const volume = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  // Buscar detalhes do volume com base no ID
  const fetchVolume = async () => {
    try {
      const response = await fetch(`http://localhost:8080/academics/api/volumes/${route.params.volumeId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar volume: ${response.statusText}`);
      }
      volume.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  const goBack = () => {
    router.push('/volumes');
  };
  
  onMounted(fetchVolume);
  </script>
  
  <style scoped>
  .card {
    background: #ffffff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 600px;
    text-align: left;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #1E3A8A;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    color: #333333;
    margin-bottom: 0.5rem;
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