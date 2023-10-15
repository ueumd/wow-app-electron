import { ElectronAPI } from '@electron-toolkit/preload'
import type { INodeFseApi, IIpcApi } from '../preload'
declare global {
  interface Window {
    electronAPI: ElectronAPI
    lazy: number
    nodeFseApi: INodeFseApi
    ipcApi: IIpcApi
    requests: []
  }

  interface IpcMessage<T = any> {
    title: string
    data: T
  }

  type IpcMessageType<T = any> = IpcMessage<T>

  interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
    time: number
  }

  type ApiPromise<T = any> = Promise<ApiResponse<T>>

  type Nullable<T> = T | null
}
