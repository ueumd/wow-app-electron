import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { userStore } from './modules/user'
import { routerStore } from './modules/router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const store: any = {}

export const registerStore = () => {
  store.userStore = userStore()
  store.routerStore = routerStore
}

export default store
