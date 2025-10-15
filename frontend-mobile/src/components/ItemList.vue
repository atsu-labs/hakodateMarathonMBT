<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const loading = ref(false)
const error = ref('')

const fetchItems = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/items')
    const data = await response.json()
    items.value = data.items || []
  } catch (err) {
    console.error('Error fetching items:', err)
    error.value = 'アイテムの取得に失敗しました'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="item-list">
    <div class="header-card">
      <h2>アイテム一覧</h2>
      <p class="item-count">{{ items.length }} 件のアイテム</p>
    </div>

    <div v-if="loading" class="loading-card">
      <div class="spinner"></div>
      <p>読み込み中...</p>
    </div>

    <div v-else-if="error" class="error-card">
      <p>{{ error }}</p>
      <button @click="fetchItems" class="retry-button">再試行</button>
    </div>

    <div v-else-if="items.length === 0" class="empty-card">
      <p>📭</p>
      <p>アイテムがありません</p>
    </div>

    <div v-else class="items-container">
      <div v-for="item in items" :key="item.id" class="item-card">
        <div class="item-id">ID: {{ item.id }}</div>
        <div class="item-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-list {
  max-width: 600px;
  margin: 0 auto;
}

.header-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-card h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.item-count {
  margin: 0;
  color: #667eea;
  font-weight: 500;
}

.loading-card,
.error-card,
.empty-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-card p,
.empty-card p {
  margin: 0;
  color: #666;
}

.empty-card p:first-child {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.error-card p {
  margin: 0 0 1rem 0;
  color: #e74c3c;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.retry-button:active {
  transform: scale(0.98);
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-card {
  background-color: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.item-card:active {
  transform: scale(0.98);
}

.item-id {
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
}

.item-name {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.1rem;
}
</style>
