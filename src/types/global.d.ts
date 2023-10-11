import { ElectronAPI } from '@electron-toolkit/preload'
declare global {
  interface Window {
    electronAPI: ElectronAPI
    lazy: number
    requests: []
  }

  interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
    time: number
  }

  interface IRenderToRenderMsg {
    id?: number
    title?: string
    data?: any
  }

  type ApiPromise<T = any> = Promise<ApiResponse<T>>

  type Nullable<T> = T | null
}
