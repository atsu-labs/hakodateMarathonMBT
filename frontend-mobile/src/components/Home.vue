<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/api/hello')
    const data = await response.json()
    message.value = data.message
  } catch (error) {
    console.error('Error fetching data:', error)
    message.value = 'Error loading data'
  }
})
</script>

<template>
  <div class="home">
    <div class="welcome-card">
      <h2>ようこそ</h2>
      <p class="subtitle">Hakodate Marathon MBT へようこそ</p>
      <div class="message-box">
        <p>{{ message || 'Loading...' }}</p>
      </div>
    </div>

    <div class="info-card">
      <h3>📱 モバイルビュー</h3>
      <p>このアプリはスマートフォンでの閲覧に最適化されています。</p>
    </div>

    <div class="nav-card">
      <h3>🔍 アイテムを見る</h3>
      <p>登録されているアイテムを確認できます。</p>
      <router-link to="/items" class="nav-button">
        アイテム一覧へ →
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
}

.welcome-card,
.info-card,
.nav-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 1.8rem;
}

.subtitle {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.message-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.message-box p {
  margin: 0;
  font-weight: 500;
}

.info-card h3,
.nav-card h3 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.info-card p,
.nav-card p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.nav-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 0.2s;
}

.nav-button:active {
  transform: scale(0.98);
}
</style>
