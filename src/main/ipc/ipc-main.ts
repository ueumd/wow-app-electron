import { BrowserWindow, ipcMain, shell } from 'electron'
import logger from '../core/logger'
import channel from '../../channel'
import nms from '../core/media-server'

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar', 'app.asar.unpacked') // 避免在Electron打包的时候找不到asar之外的ffmpeg路径。
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg')
const ffmpeg = require('fluent-ffmpeg')

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

	ipcMain.on('logger', (_, level, ...arg) => {
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

	ipcMain.on(channel.MAIN_TO_RENDERER, (_, payload) => {
		primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, payload)
	})

	/**
	 * ffmpeg 推流
	 */
	ipcMain.on(channel.FFMPEG_PUBLISH, (_, filePath) => {
		logger.info('filePath: ' + filePath)
		logger.info('ffmpegPath: ' + ffmpegPath)
		ffmpeg(filePath)
			.setFfmpegPath(ffmpegPath)
			.inputOptions('-re')
			.on('start', function (commandLine) {
				logger.info('commandLine: ' + commandLine)
				primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
					type: 'ffmpeg',
					code: 0,
					data: commandLine
				})
			})
			.on('error', function (err, stdout, stderr) {
				logger.error('error: ' + err.message)
				logger.error('stdout: ' + stdout)
				logger.error('stderr: ' + stderr)
				primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
					type: 'ffmpeg',
					code: 500,
					data: null,
					msg: err.message
				})
			})
			.on('end', function () {
				logger.info('[' + new Date() + '] video Pushing is Finished !')
				primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
					type: 'ffmpeg',
					code: 0,
					data: 'Finished'
				})
			})
			.addOptions(['-c copy'])
			.format('flv')
			.output('rtmp://127.0.0.1:5175/live/stream', {
				end: true
			})
			.run()
	})

	// 渲染进程与渲染进程通信
	ipcMain.on(channel.RENDERER_TO_RENDERER, (_, payload: IRenderToRenderMsg) => {
		const allWindows = BrowserWindow.getAllWindows()
		//const targetId = 2;
		const targetWindow = allWindows.find((w: any) => {
			if (payload.title && w.getTitle() === payload.title) {
				return w
			}
		})
		if (targetWindow) {
			targetWindow.webContents.send(channel.RENDERER_TO_RENDERER, payload)
		} else {
			console.error('窗口不存在', payload)
		}
	})

	ipcMain.on(channel.BOOT_NODE_MEDIA_SERVER, _ => {
		nms.run()

		nms.on('preConnect', (id, args) => {
			console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`)
			// let session = nms.getSession(id);
			// session.reject();
			primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
				type: 'nms',
				data: {
					id: nms.getSession(id),
					content: 'preConnect'
				},
				code: 0
			})
		})

		nms.on('postConnect', (id, args) => {
			console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`)
		})

		nms.on('doneConnect', (id, args) => {
			console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`)
			primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
				type: 'nms',
				data: 'doneConnect',
				code: 0
			})
		})

		nms.on('prePublish', (id, StreamPath, args) => {
			console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
			// let session = nms.getSession(id);
			// session.reject();
		})

		nms.on('postPublish', (id, StreamPath, args) => {
			console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
		})

		nms.on('donePublish', (id, StreamPath, args) => {
			console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
			primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
				type: 'nms',
				data: 'donePublish',
				code: 0
			})
		})

		nms.on('prePlay', (id, StreamPath, args) => {
			console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
			// let session = nms.getSession(id);
			// session.reject();
		})

		nms.on('postPlay', (id, StreamPath, args) => {
			console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
		})

		nms.on('donePlay', (id, StreamPath, args) => {
			console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`)
			primaryWindow.webContents.send(channel.MAIN_TO_RENDERER, {
				type: 'nms',
				data: 'donePlay',
				code: 0
			})
		})
	})
}
