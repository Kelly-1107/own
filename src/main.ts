import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

async function initApp() {
  // 初始化 IndexedDB
  const { initDB } = await import('./db')
  await initDB()

  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

initApp()
