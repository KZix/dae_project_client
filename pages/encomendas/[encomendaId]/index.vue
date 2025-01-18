<template>
    <div class="card">
      <h1 class="text-2xl font-bold text-blue-900 mb-4">Detalhes da Encomenda</h1>
  
      <div v-if="loading" class="text-gray-500">Carregando...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <p><strong>ID:</strong> {{ encomenda.id }}</p>
        <p><strong>Cliente:</strong> {{ encomenda.clienteUsername }}</p>
        <p><strong>Estado:</strong> {{ getEstadoText(encomenda.estado) }}</p>
        <button @click="openModal" class="button">Atualizar Encomenda</button>
        <button @click="goBack" class="button">Voltar para Lista</button>
      </div>
  
      <!-- Modal -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>Atualizar Encomenda</h2>
          <div>
            <label for="estadoSelect">Selecione o Estado:</label>
            <select v-model="selectedEstado" id="estadoSelect">
              <option value="0">Pendente</option>
              <option value="1">Enviado</option>
              <option value="2">Recebido</option>
            </select>
          </div>
          <button @click="updateEncomenda" class="button">Salvar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const encomenda = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const showModal = ref(false);
  const selectedEstado = ref(null);
  
  const fetchEncomenda = async () => {
    try {
      const response = await fetch(`http://localhost:8080/academics/api/encomendas/${route.params.encomendaId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar encomenda: ${response.statusText}`);
      }
      encomenda.value = await response.json();
      selectedEstado.value = encomenda.value.estado;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
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
    router.push('/encomendas');
  };
  
  const openModal = () => {
    showModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false;
  };
  
  const updateEncomenda = async () => {
    try {
      const response = await fetch(`http://localhost:8080/academics/api/encomendas/${route.params.encomendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estado: selectedEstado.value }),
      });
      if (!response.ok) {
        throw new Error(`Erro ao atualizar encomenda: ${response.statusText}`);
      }
      alert('Encomenda atualizada com sucesso!');
      closeModal();
      fetchEncomenda(); // Refresh encomenda details
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };
  
  onMounted(fetchEncomenda);
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
  
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  
  .close {
    float: right;
    font-size: 1.5rem;
    cursor: pointer;
  }
  </style>