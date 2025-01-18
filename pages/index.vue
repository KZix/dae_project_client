<template>
  <div class="min-h-screen flex flex-col">
    <nav class="p-4">
    </nav>
    <main class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-4">Welcome to UGANDA Management</h1>
      <p class="text-lg mb-6">Manage your orders and products efficiently.</p>
      <button>Get Started</button>
      <div class="card">
        <h2>Feature One</h2>
        <p>Details about Feature One.</p>
      </div>
    </main>
    <footer>
      <p>&copy; 2024 UGANDA Management. All rights reserved.</p>
    </footer>
  </div>
</template>
<script setup>
// No additional script needed for this example
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  color: #333333;
  background-color: #F3F4F6; /* Light gray for professionalism */
  margin: 0;
  padding: 0;
}

nav, footer {
  background-color: #1E3A8A;
  color: #ffffff;
}

nav h1 {
  font-size: 1.75rem;
  font-weight: 600;
}

main {
  background: linear-gradient(135deg, #1E3A8A, #2563EB);
  color: #ffffff;
  padding: 60px 20px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 20px;
}

main h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

main p {
  font-size: 1.25rem;
  line-height: 1.8;
}

button {
  background: linear-gradient(90deg, #10B981, #22D3EE);
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

button:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #059669, #0E7490);
}

.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  text-align: left;
}

footer {
  padding: 20px 0;
  text-align: center;
  color: #9CA3AF;
}

footer a {
  color: #ffffff;
  margin: 0 10px;
  text-decoration: none;
  transition: color 0.3s ease;
}

footer a:hover {
  color: #10B981;
}


</style>