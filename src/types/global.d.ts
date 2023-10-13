import { ElectronAPI } from '@electron-toolkit/preload'
import type { INodeFseApi } from '../preload'
declare global {
  interface Window {
    electronAPI: ElectronAPI
    lazy: number
    nodeFseApi: INodeFseApi
    requests: []
  }

  interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
    time: number
  }

  type ApiPromise<T = any> = Promise<ApiResponse<T>>

  type Nullable<T> = T | null
}
