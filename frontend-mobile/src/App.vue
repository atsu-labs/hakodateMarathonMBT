<script setup>
// モバイル閲覧ページのルートコンポーネント
</script>

<template>
  <div class="mobile-app">
    <header class="mobile-header">
      <h1>Hakodate Marathon MBT</h1>
    </header>
    <nav class="mobile-nav">
      <router-link to="/">ホーム</router-link>
      <router-link to="/items">アイテム</router-link>
    </nav>
    <main class="mobile-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.mobile-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.mobile-nav {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.mobile-nav a {
  flex: 1;
  text-align: center;
  padding: 1rem;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.mobile-nav a.router-link-active {
  color: #667eea;
  border-bottom-color: #667eea;
  background-color: #f8f9ff;
}

.mobile-main {
  flex: 1;
  padding: 1rem;
  background-color: #f5f5f5;
}
</style>
