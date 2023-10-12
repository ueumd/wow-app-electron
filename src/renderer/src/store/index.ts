import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// export default pinia

import { useUserinfo } from './userinfo'

const store: any = {}

export const registerStore = () => {
  store.userinfo = useUserinfo()
}

export default store
