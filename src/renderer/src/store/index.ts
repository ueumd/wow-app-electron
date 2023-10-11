import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// export default pinia


import { useUserinfo } from './userinfo'


export interface IAppStore {
  userinfo: ReturnType<typeof useUserinfo>
}

const store: IAppStore = {} as IAppStore

export const registerStore = () => {
  store.userinfo = useUserinfo()
}

export { store }
