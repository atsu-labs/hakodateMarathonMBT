<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const newItemName = ref('')
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

const addItem = async () => {
  if (!newItemName.value.trim()) {
    error.value = 'アイテム名を入力してください'
    return
  }

  try {
    loading.value = true
    error.value = ''
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newItemName.value })
    })

    const data = await response.json()
    if (data.success) {
      newItemName.value = ''
      await fetchItems()
    } else {
      error.value = 'アイテムの追加に失敗しました'
    }
  } catch (err) {
    console.error('Error adding item:', err)
    error.value = 'アイテムの追加に失敗しました'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="item-management">
    <h2>アイテム管理</h2>

    <div class="add-item-form">
      <h3>新しいアイテムを追加</h3>
      <div class="form-group">
        <input
          v-model="newItemName"
          type="text"
          placeholder="アイテム名"
          @keyup.enter="addItem"
          :disabled="loading"
        />
        <button @click="addItem" :disabled="loading">
          {{ loading ? '追加中...' : '追加' }}
        </button>
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>

    <div class="items-list">
      <h3>アイテム一覧</h3>
      <div v-if="loading && items.length === 0" class="loading">
        読み込み中...
      </div>
      <div v-else-if="items.length === 0" class="empty-state">
        アイテムがありません
      </div>
      <table v-else class="items-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.item-management {
  width: 100%;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.add-item-form {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  gap: 1rem;
}

.form-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group button {
  padding: 0.75rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-group button:hover:not(:disabled) {
  background-color: #359268;
}

.form-group button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.items-list {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.items-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #2c3e50;
}

.items-table tr:last-child td {
  border-bottom: none;
}

.items-table tbody tr:hover {
  background-color: #f8f8f8;
}
</style>
