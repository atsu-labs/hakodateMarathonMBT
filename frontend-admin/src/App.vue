<script setup>
// 管理ページのルートコンポーネント
</script>

<template>
  <div class="admin-app">
    <header class="admin-header">
      <h1>Hakodate Marathon MBT - 管理画面</h1>
      <nav>
        <router-link to="/">ダッシュボード</router-link>
        <router-link to="/items">アイテム管理</router-link>
      </nav>
    </header>
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
}

.admin-header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.admin-header nav {
  display: flex;
  gap: 1rem;
}

.admin-header nav a {
  color: #42b983;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.admin-header nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-header nav a.router-link-active {
  background-color: #42b983;
  color: white;
}

.admin-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
