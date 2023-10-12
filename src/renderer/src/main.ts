import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import ElementPlus from 'element-plus'
import { registerStore } from '@renderer/store'
import emitter from '@renderer/utils/emitter'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import '@renderer/styles/index.scss'

import { config } from '@renderer/config'

console.log(config)

const start = (): void => {
  const app = createApp(App)
  app.config.globalProperties.$mitt = emitter

  // 注册 Pinia
  app.use(createPinia())
  registerStore()

  // app.use(router)
  app.use(ElementPlus)

  app.use(router)

  app.mount('#app')
}

start()
