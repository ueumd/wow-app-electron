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

	interface IRenderToRenderMsg {
		title: string
		data?: any
	}

	/** 接口返回数据格式 */
	interface ApiResponse<T = any> {
		code: number
		data: T
		message: string
		time: number
	}

	/** 接口返回的列表数据 */
	interface ApiListData<T> {
		total: number
		list: T
		[propName: string]: unknown
	}

	type ApiPromise<T = any> = Promise<ApiResponse<T>>

	type Nullable<T> = T | null
}
