import { electronAPI } from '@electron-toolkit/preload'
import channel from '../../channel'
import { IWindowsConfig } from '../../types/electron-env'

// import ffmpeg from 'fluent-ffmpeg'
// import ffmpegPath from '@ffmpeg-installer/ffmpeg'

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
	 * 向主进程发送消息
	 * @param payload
	 */
	sendMsgToMain(payload) {
		electronAPI.ipcRenderer.send(channel.MAIN_TO_RENDERER, payload)
	}

	/**
	 * 主进程向渲染发送消息
	 * @param callback
	 */
	onMainMsg(callback) {
		electronAPI.ipcRenderer.removeAllListeners(channel.MAIN_TO_RENDERER)
		electronAPI.ipcRenderer.on(channel.MAIN_TO_RENDERER, (_, data) => {
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
	 * 根据标题向目标窗口发送消息
	 * @param title
	 * @param data
	 */
	sendMessageByWinTitle({ title, data }: IRenderToRenderMsg) {
		electronAPI.ipcRenderer.send(channel.RENDERER_TO_RENDERER, { title, data })
	}

	/**
	 * 目标窗口收接消息
	 * @param callback
	 */
	onRecMessageByWinTitle(callback: (T) => void) {
		electronAPI.ipcRenderer.removeAllListeners(channel.RENDERER_TO_RENDERER)
		electronAPI.ipcRenderer.on(channel.RENDERER_TO_RENDERER, (_, data) => {
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

	sendCapture() {
		electronAPI.ipcRenderer.on('SET_SOURCE', async (_, sourceId) => {
			console.log('sourceId: ', sourceId)
		})
	}

	/**
	 * 启动 SMTP 服务
	 */
	bootNodeMediaServe() {
		electronAPI.ipcRenderer.send(channel.BOOT_NODE_MEDIA_SERVER)
	}

	sendExecuteFfmpeg(filePath: string) {
		electronAPI.ipcRenderer.send(channel.FFMPEG_PUBLISH, filePath)
	}
}
