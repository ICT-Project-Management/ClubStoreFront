import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import  i18n  from './i18n.ts'
createApp(App)
.use(router)
.use(createPinia())
.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  newestOnTop: true,
})
.use(i18n)
.mount('#app')

