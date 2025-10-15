import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './components/Home.vue'
import ItemList from './components/ItemList.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/items', component: ItemList, name: 'items' }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
