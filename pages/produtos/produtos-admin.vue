<template>
  <div>
    <!-- Verificar se o usuário é um administrador -->
    <div v-if="!isAdmin">
      <p>Apenas administradores podem acessar esta página.</p>
    </div>

    <div v-else>
      <!-- Gerenciar Tipos de Produtos -->
      <h1>Gerenciar Tipos de Produtos</h1>
      <form @submit.prevent="saveType">
        <label>Nome:</label>
        <input v-model="currentType.nome" required />
        <button type="submit">{{ currentType.id ? 'Atualizar' : 'Adicionar' }}</button>
      </form>

      <div v-if="types.length">
        <ul>
          <li v-for="type in types" :key="type.id">
            {{ type.nome }}
            <button @click="editType(type)">Editar</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Nenhum tipo de produto cadastrado.</p>
      </div>

      <!-- Gerenciar Produtos -->
      <h1>Gerenciar Produtos</h1>
      <form @submit.prevent="saveProduct">
        <label>Nome:</label>
        <input v-model="currentProduct.nome" required />

        <label>Preço (€):</label>
        <input type="number" step="0.01" v-model="currentProduct.preco" required />

        <label>Tipo de Produto:</label>
        <select v-model="currentProduct.tipoProdutoId" required>
          <option v-for="type in types" :key="type.id" :value="type.id">
            {{ type.nome }}
          </option>
        </select>

        <button type="submit">{{ currentProduct.id ? 'Atualizar' : 'Adicionar' }} Produto</button>
      </form>

      <div v-if="products.length">
        <ul>
          <li v-for="product in products" :key="product.id">
            {{ product.nome }} - {{ product.preco }}€
            <button @click="editProduct(product)">Editar</button>
            <button @click="deleteProduct(product.id)">Excluir</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Nenhum produto cadastrado.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth-store'; // Supondo que o store esteja aqui
import { useRuntimeConfig } from '#app';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);  // Verifica se o usuário é administrador

const config = useRuntimeConfig();
const apiUrl = config.public.API_URL;

const products = ref([]);
const types = ref([]);
const currentProduct = ref({
  id: null,
  nome: '',
  preco: 0.0,  // Garantindo que o preço seja um float
  tipoProdutoId: null
});
const currentType = ref({
  id: null,
  nome: ''
});

// Buscar todos os produtos
async function fetchProducts() {
  const response = await $fetch(`${apiUrl}/produtos/complete`);
  products.value = response;
}

// Buscar todos os tipos de produtos
async function fetchTypes() {
  const response = await $fetch(`${apiUrl}/tipo_produtos`);
  types.value = response;
}

// Salvar ou atualizar um tipo de produto
async function saveType() {
  if (currentType.value.id) {
    await $fetch(`${apiUrl}/tipo_produtos/${currentType.value.id}`, {
      method: 'PUT',
      body: currentType.value,
    });
  } else {
    await $fetch(`${apiUrl}/tipo_produtos`, {
      method: 'POST',
      body: currentType.value,
    });
  }
  currentType.value = { id: null, nome: '' };
  await fetchTypes();
}

// Editar tipo de produto
function editType(type) {
  currentType.value = { ...type };
}

// Salvar ou atualizar um produto
async function saveProduct() {
  const productData = {
    nome: currentProduct.value.nome,
    preco: parseFloat(currentProduct.value.preco),  // Converte o preço para float
    tipoProdutoId: currentProduct.value.tipoProdutoId  // Envia o tipoProdutoId corretamente
  };

  if (currentProduct.value.id) {
    await $fetch(`${apiUrl}/produtos/${currentProduct.value.id}`, {
      method: 'PUT',
      body: productData,
    });
  } else {
    await $fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      body: productData,
    });
  }
  currentProduct.value = { id: null, nome: '', preco: 0.0, tipoProdutoId: null };
  await fetchProducts();
}

// Editar produto
function editProduct(product) {
  if (product && product.id) {
    currentProduct.value = { ...product, tipoProdutoId: product.tipoProduto.id };
  } else {
    console.error('Produto inválido:', product);
  }
}

// Excluir produto
async function deleteProduct(productId) {
  try {
    await $fetch(`${apiUrl}/produtos/${productId}`, {
      method: 'DELETE',
    });
    await fetchProducts();
  } catch (e) {
    console.error('Erro ao excluir produto:', e);
    alert('Erro ao excluir produto. Tente novamente.');
  }
}

onMounted(() => {
  fetchProducts();
  fetchTypes();
});
</script>


