import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { registerStore } from '@/store'
import emitter from '@/utils/emitter'
import { i18n } from './i18n'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

import '@/styles/index.scss'
const start = (): void => {
	const app = createApp(App)
	app.config.globalProperties.$mitt = emitter

	// 注册 Pinia
	app.use(createPinia())
	registerStore()

	app.use(ElementPlus, {
		locale: zhCn
	})

	app.use(router)

	app.use(i18n)

	app.mount('#app')
}

start()
