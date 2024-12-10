// Assuming you're using Vue 3 with Composition API
<template>
  <div class="app">
    <nav>
      <button @click="view = 'products'">Products</button>
      <button @click="view = 'cart'">Cart ({{ cart.length }})</button>
    </nav>

    <div v-if="view === 'products'">
      <h1>Products</h1>
      <div class="product" v-for="product in products" :key="product.id">
        <h2>{{ product.name }}</h2>
        <p>Price: ${{ product.price.toFixed(2) }}</p>
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>

    <div v-if="view === 'cart'">
      <h1>Your Cart</h1>
      <div v-if="cart.length === 0">Your cart is empty.</div>
      <div v-for="item in cart" :key="item.id">
        <h2>{{ item.name }}</h2>
        <p>Price: ${{ item.price.toFixed(2) }}</p>
        <button @click="removeFromCart(item.id)">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view: 'products', // Switch between 'products' and 'cart'
      products: [
        { id: 1, name: 'Smartphone', price: 699.99 },
        { id: 2, name: 'Jeans', price: 49.99 },
        { id: 3, name: 'Headphones', price: 129.99 },
      ],
      cart: [],
    };
  },
  methods: {
    addToCart(product) {
      this.cart.push(product);
    },
    removeFromCart(productId) {
      this.cart = this.cart.filter((item) => item.id !== productId);
    },
  },
};
</script>

<style>
nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
