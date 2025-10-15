<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')
const stats = ref({
  totalItems: 0,
  lastUpdate: new Date().toLocaleString('ja-JP')
})

onMounted(async () => {
  try {
    const response = await fetch('/api/hello')
    const data = await response.json()
    message.value = data.message

    // アイテム数を取得
    const itemsResponse = await fetch('/api/items')
    const itemsData = await itemsResponse.json()
    stats.value.totalItems = itemsData.items?.length || 0
  } catch (error) {
    console.error('Error fetching data:', error)
    message.value = 'Error loading data'
  }
})
</script>

<template>
  <div class="dashboard">
    <h2>ダッシュボード</h2>
    <div class="welcome-message">
      <p>{{ message || 'Loading...' }}</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>総アイテム数</h3>
        <p class="stat-value">{{ stats.totalItems }}</p>
      </div>
      <div class="stat-card">
        <h3>最終更新</h3>
        <p class="stat-value">{{ stats.lastUpdate }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.welcome-message {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: normal;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #42b983;
}
</style>
