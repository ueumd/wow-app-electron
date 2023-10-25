import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { userStore } from './modules/user'
import { routerStore } from './modules/router'
import { appStore } from './modules/app'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const store: any = {}

export const registerStore = () => {
	store.userStore = userStore()
	store.routerStore = routerStore()
	store.appStore = appStore()
}

export default store
