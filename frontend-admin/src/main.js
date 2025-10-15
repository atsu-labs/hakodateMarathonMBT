import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Dashboard from './components/Dashboard.vue'
import ItemManagement from './components/ItemManagement.vue'

const router = createRouter({
  history: createWebHistory('/admin'),
  routes: [
    { path: '/', component: Dashboard, name: 'dashboard' },
    { path: '/items', component: ItemManagement, name: 'items' }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
