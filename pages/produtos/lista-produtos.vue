<template>
  <div>
    <h1>Lista de Produtos</h1>

    <!-- Filtro por Tipo de Produto -->
    <label for="product-type">Filtrar por tipo de produto:</label>
    <select id="product-type" v-model="selectedType" @change="filterProducts">
      <option value="">All</option>
      <option
          v-for="type in productTypes"
          :key="type.id"
          :value="type.nome"
      >
        {{ type.nome }}
      </option>
    </select>

    <!-- Lista de Produtos -->
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else-if="isLoading">Loading products...</div>
    <div v-else>
      <div v-for="product in filteredProducts" :key="product.id" class="product">
        <h2>{{ product.nome }}</h2>
        <p>Preço: {{ product.preco }}€</p>
        <p>Tipo: {{ product.tipoProduto.nome }}</p>
        <button @click="addToCart(product)">Adicionar ao Carrinho</button>
      </div>
    </div>

    <!-- Carrinho -->
    <h1>Carrinho</h1>
    <div v-if="cart.length === 0">Seu carrinho está vazio.</div>
    <div v-else>
      <ul>
        <li v-for="item in cart" :key="item.id">
          {{ item.nome }}
          <button @click="removeFromCart(item)">Remover</button>
        </li>
      </ul>
    </div>

    <!-- Botão de Comprar -->
    <div>
      <p v-if="!authStore.user">Você precisa estar logado para realizar uma compra.</p>
      <p v-else-if="authStore.user.role !== 'Client'">Somente clientes podem realizar compras.</p>
      <button
          :disabled="!authStore.user || authStore.user.role !== 'Client'"
          @click="handlePurchase">
        Comprar
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth-store'; // Caminho para sua store de autenticação
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const apiUrl = config.public.API_URL;

const authStore = useAuthStore();

// Estados reativos
const products = ref([]);
const filteredProducts = ref([]);
const selectedType = ref('');
const cart = ref([]);
const error = ref(null);
const isLoading = ref(false);

// Obter produtos da API
async function fetchProducts() {
  isLoading.value = true;
  try {
    const response = await $fetch(`${apiUrl}/produtos/complete`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    products.value = response;
    filteredProducts.value = response;
    error.value = null;
  } catch (e) {
    console.error('Failed to fetch products:', e);
    error.value = e;
  } finally {
    isLoading.value = false;
  }
}

// Obter tipos únicos de produtos
const productTypes = computed(() => {
  const types = products.value.map((product) => product.tipoProduto);
  return [...new Map(types.map((type) => [type.id, type])).values()];
});

// Filtrar produtos por tipo
watch(
    () => selectedType.value,
    () => {
      filterProducts();
    }
);

function filterProducts() {
  if (!selectedType.value) {
    filteredProducts.value = products.value;
  } else {
    filteredProducts.value = products.value.filter(
        (product) => product.tipoProduto.nome === selectedType.value
    );
  }
}

// Adicionar ao carrinho
function addToCart(product) {
  // Adiciona o produto diretamente ao carrinho sem verificar a quantidade
  const cartItem = cart.value.find((item) => item.id === product.id);
  if (!cartItem) {
    cart.value.push({...product});  // Não inclui a quantidade
  }
}

// Remover do carrinho
function removeFromCart(product) {
  const index = cart.value.findIndex((item) => item.id === product.id);
  if (index !== -1) {
    cart.value.splice(index, 1);  // Remove o produto do carrinho
  }
}

// Função para realizar a compra
async function handlePurchase() {
  if (!authStore.user || authStore.user.role !== 'Client') {
    alert('Apenas clientes podem realizar compras.');
    return;
  }

  try {
    // Criar encomenda
    const orderResponse = await $fetch(`${apiUrl}/encomendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: {clienteUsername: authStore.user.username,estado:0},
    });

    const orderId = orderResponse.id;

    createVolumes(orderId);

    alert('Compra realizada com sucesso!');
    cart.value = [];
  } catch (e) {
    console.error('Erro ao processar a compra:', e);
    alert('Erro ao processar a compra. Tente novamente mais tarde.');
  }
}

async function createVolumes(orderId) {
  if (!authStore.token) {
    console.error("User is not authenticated. Cannot create volumes.");
    return;
  }

  if (!cart.value || cart.value.length === 0) {
    console.warn("Cart is empty. No volumes to create.");
    return;
  }

  // Agrupar produtos no carrinho por tipo
  const groupedCart = groupCartByType();

  for (const [typeId, items] of Object.entries(groupedCart)) {
    try {
      // Criar um volume para o tipo de produto
      const volumeResponse = await $fetch(`${apiUrl}/volumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: {
          descricao: `Volume for type ${typeId}`,
          danificada: 0, // Inicialmente marcamos como não danificada
          encomendaId: orderId,
        },
      });

      const volumeId = volumeResponse.id;
      console.log(`Volume created for type ${typeId}:`, volumeResponse);

      // Associar os produtos ao volume criado
      const productIds = items.map((item) => item.id);

      await $fetch(`${apiUrl}/volumes/${volumeId}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: productIds,
      });

      console.log(`Products added to volume ${volumeId}:`, productIds);
    } catch (error) {
      console.error(`Failed to create volume or associate products for type ${typeId}:`, error);
    }
  }
}

// Agrupar carrinho por tipo de produto
function groupCartByType() {
  return cart.value.reduce((acc, item) => {
    const typeId = item.tipoProduto.id;
    if (!acc[typeId]) acc[typeId] = [];
    acc[typeId].push({id: item.id});  // Remove a quantidade ao associar o produto
    return acc;
  }, {});
}

// Inicializar produtos ao carregar o componente
onMounted(() => {
  fetchProducts();
});
</script>

<style>
.product {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
