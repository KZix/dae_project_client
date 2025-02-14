<template>
  <div class="card">
    <h1 class="text-2xl font-bold text-blue-900 mb-4">Detalhes do Volume</h1>

    <div v-if="loading" class="text-gray-500">Carregando...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <p><strong>ID:</strong> {{ volume.id }}</p>
      <p><strong>Descrição:</strong> {{ volume.descricao }}</p>
      <p><strong>Danificado:</strong> {{ volume.danificado === 1 ? 'Sim' : 'Não' }}</p>
      <p><strong>ID da Encomenda:</strong> {{ volume.encomendaId }}</p>
      <h2 class="text-xl font-bold text-blue-900 mt-4">Produtos</h2>
      <ul>
        <li v-for="produto in volume.produtos" :key="produto.id">
          {{ produto.nome }} - {{ produto.tipoProduto.nome }}
        </li>
      </ul>
      <button @click="openAddModal" class="button">Adicionar Produtos</button>
      <button @click="openDeleteModal" class="button-delete">Apagar Produtos</button>
      <button @click="openEditModal" class="button-edit">Editar Volume</button>
      <button @click="goBack" class="button">Voltar para Lista</button>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddModal">&times;</span>
        <h2>Adicionar Produtos</h2>
        <div>
          <label for="produtoSelect">Selecione os Produtos:</label>
          <select v-model="selectedProdutoId" id="produtoSelect">
            <option v-for="produto in produtos" :key="produto.id" :value="produto.id">
              {{ produto.nome }}
            </option>
          </select>
        </div>
        <button @click="addProduto" class="button">Adicionar</button>
        <ul>
          <li v-for="produto in selectedProdutos" :key="produto.id">
            {{ produto.nome }} <button @click="removeProduto(produto.id)">Remover</button>
          </li>
        </ul>
        <button @click="saveProdutos" class="button">Salvar</button>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDeleteModal">&times;</span>
        <h2>Apagar Produtos</h2>
        <div>
          <label for="deleteProdutoSelect">Selecione os Produtos para Apagar:</label>
          <select v-model="selectedDeleteProdutoId" id="deleteProdutoSelect">
            <option v-for="produto in volume.produtos" :key="produto.id" :value="produto.id">
              {{ produto.nome }}
            </option>
          </select>
        </div>
        <button @click="deleteProduto" class="button-delete">Apagar</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Volume</h2>
        <div>
          <label for="descricao">Descrição:</label>
          <input type="text" v-model="editDescricao" id="descricao" />
        </div>
        <div>
          <label for="danificado">Danificado:</label>
          <select v-model="editDanificado" id="danificado">
            <option value=0>Não</option>
            <option value=1>Sim</option>
          </select>
        </div>
        <div>
          <label for="encomendaId">ID da Encomenda:</label>
          <input type="number" v-model="editEncomendaId" id="encomendaId" />
        </div>
        <button @click="updateVolume" class="button">Salvar</button>
      </div>
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
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const produtos = ref([]);
const selectedProdutoId = ref(null);
const selectedProdutos = ref([]);
const selectedDeleteProdutoId = ref(null);
const editDescricao = ref('');
const editDanificado = ref(0);
const editEncomendaId = ref(null);

const fetchVolume = async () => {
  try {
    const response = await fetch(`http://localhost:8080/academics/api/volumes/${route.params.volumeId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar volume: ${response.statusText}`);
    }
    volume.value = await response.json();
    editDescricao.value = volume.value.descricao;
    editDanificado.value = volume.value.danificada;
    editEncomendaId.value = volume.value.encomendaId;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchProdutos = async () => {
  try {
    const response = await fetch('http://localhost:8080/academics/api/produtos');
    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
    }
    produtos.value = await response.json();
  } catch (err) {
    error.value = err.message;
  }
};

const goBack = () => {
  router.push('/volumes');
};

const openAddModal = () => {
  showAddModal.value = true;
  fetchProdutos();
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const addProduto = () => {
  const produto = produtos.value.find(p => p.id === selectedProdutoId.value);
  if (produto && !selectedProdutos.value.some(p => p.id === produto.id)) {
    selectedProdutos.value.push(produto);
  }
};

const removeProduto = (id) => {
  selectedProdutos.value = selectedProdutos.value.filter(p => p.id !== id);
};

const saveProdutos = async () => {
  try {
    const ids = selectedProdutos.value.map(p => p.id);
    const response = await fetch(`http://localhost:8080/academics/api/volumes/${route.params.volumeId}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    });
    if (!response.ok) {
      throw new Error(`Erro ao adicionar produtos: ${response.statusText}`);
    }
    alert('Produtos adicionados com sucesso!');
    closeAddModal();
    fetchVolume(); // Refresh volume details
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
};

const deleteProduto = async () => {
  try {
    const ids = [selectedDeleteProdutoId.value];
    const response = await fetch(`http://localhost:8080/academics/api/volumes/${route.params.volumeId}/removeProdutos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ produtos: ids }),
    });
    if (!response.ok) {
      throw new Error(`Erro ao apagar produtos: ${response.statusText}`);
    }
    alert('Produtos apagados com sucesso!');
    closeDeleteModal();
    fetchVolume(); // Refresh volume details
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
};

const updateVolume = async () => {

  try {
    const response = await $fetch(`http://localhost:8080/academics/api/volumes/${route.params.volumeId}`, {
      method: 'PUT',
      body:{
        descricao: editDescricao.value,
        danificada: editDanificado.value,
        encomendaId: editEncomendaId.value
      },
    });
    alert('Volume atualizado com sucesso!');
    closeEditModal();
    fetchVolume(); // Refresh volume details
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
};

onMounted(fetchVolume);
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
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

.button-delete {
  background: linear-gradient(90deg, #EF4444, #F87171);
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.button-delete:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #DC2626, #B91C1C);
}

.button-edit {
  background: linear-gradient(90deg, #F59E0B, #FBBF24);
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.button-edit:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #D97706, #B45309);
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