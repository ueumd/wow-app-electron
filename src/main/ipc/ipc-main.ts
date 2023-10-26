import { BrowserWindow, ipcMain, shell } from 'electron'
import logger from '../core/logger'
import channel from '../../channel'

export function initIpcMain(primaryWindow) {
	/**
	 * 渲染进程日志处理
	 * IPC输出渲染进程日志
	 * 渲染进程调用
	 * ipcRenderer.invoke('logger', 'info', '输出日志内容'
	 */
	ipcMain.handle('logger', (_, level, ...arg) => {
		if (level === 'info') {
			logger.info(...arg)
		} else if (level === 'warn') {
			logger.warn(...arg)
		} else if (level === 'error') {
			logger.error(...arg)
		} else if (level === 'debug') {
			logger.debug(...arg)
		}
	})

	ipcMain.on('openLink', (_, params) => {
		shell.openExternal(params)
	})

	ipcMain.on(channel.MAIN_RENDERER_MESSAGE, (_, payload) => {
		primaryWindow.webContents.send(channel.MAIN_RENDERER_MESSAGE, payload)
	})

	// 渲染进程与渲染进程通信（父窗口向子窗口发送信息）
	ipcMain.on(channel.INTER_RENDERER_MESSAGE_TO_CHILD_WINDOW, (_, payload: IRenderToRenderMsg) => {
		const allWindows = BrowserWindow.getAllWindows()
		//const targetId = 2;
		const targetWindow = allWindows.find((w: any) => {
			if (payload.title && w.getTitle() === payload.title) {
				return w
			}
		})
		if (targetWindow) {
			targetWindow.webContents.send(channel.INTER_RENDERER_MESSAGE_TO_CHILD_WINDOW, payload)
		} else {
			console.error('子窗口不存在', payload)
		}
	})

	// 渲染进程与渲染进程通信（子窗口向父窗口发送信息）
	ipcMain.on(channel.INTER_RENDERER_MESSAGE_TO_PARENT_WINDOW, (_, payload: IRenderToRenderMsg) => {
		const allWindows = BrowserWindow.getAllWindows()
		const targetWindow = allWindows.find((w: any) => {
			if (payload.title && w.getTitle() === payload.title) {
				return w
			}
		})

		if (targetWindow) {
			targetWindow.webContents.send(channel.INTER_RENDERER_MESSAGE_TO_PARENT_WINDOW, payload)
		} else {
			console.error('父窗口不存在')
		}
	})
}
