import { electronAPI } from '@electron-toolkit/preload'
import channel from '../../channel'
import { IWindowsConfig } from '../../types/electron-env'

export class IpcApi {
	private static instance: IpcApi

	public static getInstance() {
		if (this.instance) return this.instance
		return (this.instance = new IpcApi())
	}

	logger(level, ...args) {
		electronAPI.ipcRenderer.send('logger', level, ...args)
	}

	emit(channel: string, payload?: any) {
		electronAPI.ipcRenderer.send(channel, payload)
	}

	/**
	 * main - renderer
	 * @param payload
	 */
	send(payload) {
		electronAPI.ipcRenderer.send(channel.MAIN_RENDERER_MESSAGE, payload)
	}

	/**
	 * main - renderer
	 * @param callback
	 */
	on(callback) {
		electronAPI.ipcRenderer.on(channel.MAIN_RENDERER_MESSAGE, (_, data) => {
			callback(data)
		})
	}

	/**
	 * 创建窗口 返回新窗口ID
	 * @param payload
	 */
	sendCreateChildWindow(payload: IWindowsConfig) {
		electronAPI.ipcRenderer.send(channel.CREATE_CHILD_WINDOW, payload)
		// 成功回调
		return new Promise((resolve, _) => {
			electronAPI.ipcRenderer.on(channel.CREATE_CHILD_WINDOW, (_, data) => {
				return resolve(data)
			})
		})
	}

	/**
	 * 父窗口 向 子窗口发送消息
	 * @param title 子窗口标题
	 * @param data 发送信息
	 */
	sendMessageToChildWindow({ title, data }: IRenderToRenderMsg) {
		electronAPI.ipcRenderer.send(channel.INTER_RENDERER_MESSAGE_TO_CHILD_WINDOW, { title, data })
	}

	/**
	 * 子窗口 接收 父窗口 消息
	 * @param callback
	 */
	onRecParentWindowMessage(callback: (T) => void) {
		electronAPI.ipcRenderer.on(channel.INTER_RENDERER_MESSAGE_TO_CHILD_WINDOW, (_, data) => {
			callback(data)
		})
	}

	/**
	 * 子窗口 向 父窗口发送消息
	 * @param title 父窗口标题
	 * @param data 发送信息
	 */
	sendMessageToParentWindow({ title, data }: IRenderToRenderMsg) {
		electronAPI.ipcRenderer.send(channel.INTER_RENDERER_MESSAGE_TO_PARENT_WINDOW, { title, data })
	}

	/**
	 * 父窗口 接收 子窗口 消息
	 * @param callback
	 */
	onRecChildWindowMessage(callback: (T) => void) {
		electronAPI.ipcRenderer.on(channel.INTER_RENDERER_MESSAGE_TO_PARENT_WINDOW, (_, data) => {
			callback(data)
		})
	}

	/**
	 * 关闭子窗口
	 * @param payload
	 */
	sendCloseChildWindow(payload: { title: string; data?: any }) {
		electronAPI.ipcRenderer.send(channel.CLOSE_CHILD_WINDOW, payload)
		// 成功回调
		return new Promise((resolve, reject) => {
			electronAPI.ipcRenderer.on(channel.CLOSE_CHILD_WINDOW, (_, data) => {
				if (data?.code === 0) {
					return resolve(data)
				}
				reject(data)
			})
		})
	}
}
