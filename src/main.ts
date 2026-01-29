import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import './styles/shadcn.css'
import { VueQueryPlugin } from '@tanstack/vue-query'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia).use(router).use(VueQueryPlugin)

app.mount('#app')
