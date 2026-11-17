import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { vPilula, vValor } from './movimento'

createApp(App).use(router).directive('pilula', vPilula).directive('valor', vValor).mount('#app')
