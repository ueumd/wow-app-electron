import { Storage } from '@/utils/storage'
import CacheKey from '@/utils/cache/key'

// 缓存
class Cache {
  getToken = (): string => {
    return Storage.getItem(CacheKey.TokenKey) || ''
  }

  setToken = (value: string) => {
    Storage.setItem(CacheKey.TokenKey, value)
  }

  getRefreshToken = (): string => {
    return Storage.getItem(CacheKey.RefreshTokenKey) || ''
  }

  setRefreshToken = (value: string) => {
    Storage.setItem(CacheKey.RefreshTokenKey, value)
  }

  getSidebarOpened = (): boolean => {
    return Storage.getItem(CacheKey.SidebarOpenedKey) || false
  }

  setSidebarOpened = (value: boolean) => {
    Storage.setItem(CacheKey.SidebarOpenedKey, value)
  }

  getLanguage = (): string => {
    return Storage.getItem(CacheKey.LangKey) || 'zh-CN'
  }

  setLanguage = (value: string) => {
    Storage.setItem(CacheKey.LangKey, value)
  }

  getComponentSize = (): string => {
    return Storage.getItem(CacheKey.ComponentSizeKey) || 'default'
  }

  setComponentSize = (value: string) => {
    Storage.setItem(CacheKey.ComponentSizeKey, value)
  }
}

export default new Cache()
